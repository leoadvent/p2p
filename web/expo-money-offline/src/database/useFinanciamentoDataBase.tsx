import { useSQLiteContext } from 'expo-sqlite';
import uuid from 'react-native-uuid';
import { CUSTOMER } from '../types/customer';
import { FINANCIAMENTO, FINANCIAMENTO_PAGAMENTO, MODALIDADE } from '../types/financiamento';
import { INVESTIMENTO } from '../types/investimento';
import { TIPOFINANCIAMENTO } from '../types/tiposFinanciamento';

export function useFinanciamentoDataBase() {
    
    const dataBase = useSQLiteContext();

    function round2(value: number | undefined | null): number {
    if (value == null) return 0;
        return Math.round(value * 100) / 100;
    }

    async function create (financiamento: Omit<FINANCIAMENTO, 'id'>){

        const idFinanciamento  = uuid.v4();

        const sqlFinanciamento = `
            INSERT INTO FINANCIAMENTO ( 
                id, dataInicio, dataFim, valorFinanciado,taxaJuros, taxaJurosAtraso, adicionalDiaAtraso,valorDiaria, valorMontante, valorPago, modalidade, periodocidade, totalParcelas, finalizado, atrasado, cliente_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

        const sqlFinanciamentoPagament = `
            INSERT INTO FINANCIAMENTO_PAGAMENTO (
                id, dataVencimento, dataPagamento, dataUltimoPagamento, numeroParcela, valorPago, valorAtual, valorParcela, valorDiaria, juros, jurosAtraso, modalidade, executadoEmpenho, pagamentoRealizado, renegociado, cliente_id, financiamento_id  
            ) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const statementFinanciamento          = await dataBase.prepareAsync(sqlFinanciamento);
        const statementFinanciamentoPagamento = await dataBase.prepareAsync(sqlFinanciamentoPagament);

        try {

            const resultFinanciamento = await statementFinanciamento.executeAsync([
                idFinanciamento,
                financiamento.dataInicio instanceof Date ? financiamento.dataInicio.toISOString() : financiamento.dataInicio,
                financiamento.dataFim instanceof Date ? financiamento.dataFim.toISOString() : financiamento.dataFim,
                round2(financiamento.valorFinanciado),
                financiamento.taxaJuros,
                financiamento.taxaJurosAtraso,
                round2(financiamento.adicionalDiaAtraso),
                round2(financiamento.valorDiaria),
                round2(financiamento.valorMontante),
                round2(financiamento.valorPago),
                financiamento.modalidade,
                financiamento.periodocidade,
                financiamento.totalParcelas,
                financiamento.finalizado,
                financiamento.atrasado,
                financiamento.cliente.id
            ]);

             // Inserção dos pagamentos relacionados
            for (const item of financiamento.pagamentos) {
                const idPagamento = uuid.v4() as string;

                const retorno = await statementFinanciamentoPagamento.executeAsync([
                idPagamento,
                item.dataVencimento instanceof Date ? item.dataVencimento.toISOString() : item.dataVencimento,
                item.dataPagamento ? (item.dataPagamento instanceof Date ? item.dataPagamento.toISOString() : item.dataPagamento) : null,
                item.dataUltimoPagamento.toISOString(),
                item.numeroParcela,
                round2(item.valorPago ?? 0),
                round2(item.valorAtual ?? 0),
                round2(item.valorParcela ?? 0),
                round2(item.valorDiaria ?? 0),
                item.juros,
                item.jurosAtraso,
                item.modalidade,
                item.executadoEmpenho ? 1 : 0,
                item.pagamentoRealizado,
                item.renegociado ? 1 : 0,
                item.cliente.id,
                idFinanciamento
                ]);

            }
            
        }catch (error) {
            console.error("Error ao criar CUSTOMER:", error);
            throw error;
        } finally {
            await statementFinanciamento.finalizeAsync();
            await statementFinanciamentoPagamento.finalizeAsync();
        }

    }

    async function atualizarPagamentosAtrasados() {
        try {
            // Atualiza o valorAtual nos pagamentos atrasados
            const sqlUpdate1 = `
                UPDATE FINANCIAMENTO_PAGAMENTO
                SET valorAtual = (
                SELECT 
                    ROUND(
                    -- COALESCE(fp.valorDiaria, 0) + 
                    ((julianday('now') - julianday(fp.dataVencimento)) * COALESCE(f.adicionalDiaAtraso, 0))
                  , 
                    2
                    ) - COALESCE(fp.valorPago, 0) + COALESCE(fp.valorParcela, 0)
                FROM FINANCIAMENTO f
                WHERE f.id = fp.financiamento_id
                )
                FROM FINANCIAMENTO_PAGAMENTO fp
                WHERE 
                fp.id = FINANCIAMENTO_PAGAMENTO.id
                AND fp.dataPagamento IS NULL
                AND DATE(fp.dataVencimento) < DATE('now')
                AND fp.modalidade = 'Parcelado'
                ;
            `;

            // Atualiza o campo "atrasado" nos financiamentos com pelo menos um pagamento vencido
            const sqlUpdate2 =`
                UPDATE FINANCIAMENTO
                SET atrasado = 1
                WHERE id IN (
                SELECT DISTINCT financiamento_id
                FROM FINANCIAMENTO_PAGAMENTO
                WHERE 
                    dataPagamento IS NULL
                    AND DATE(dataVencimento) < DATE('now')
                );
            `;

            const statementSqlUpdate1  = await dataBase.prepareAsync(sqlUpdate1);
            const statementSqlUpdate2  = await dataBase.prepareAsync(sqlUpdate2);

            await statementSqlUpdate1.executeAsync()
            await statementSqlUpdate2.executeAsync()

            return true;
        } catch (error) {
            alert(error)
            return false;
        }
    }

    async function  buscarFinanciamentoPorCliente(idCliente:string, tipo: TIPOFINANCIAMENTO) {
        try {
            
            let sql = `
                SELECT * FROM FINANCIAMENTO f WHERE f.cliente_id = $cliente_id
            `
            let filtro = ` AND f.finalizado = ${tipo === TIPOFINANCIAMENTO.fechado ? 1 : 0} `

            if(tipo === TIPOFINANCIAMENTO.aberto){
                filtro += ' AND f.atrasado = 0'
            } else if (tipo === TIPOFINANCIAMENTO.atrasado) {
                filtro += ' AND f.atrasado = 1'
            } 

            sql += filtro

            const rows = await dataBase.getAllAsync(sql, { $cliente_id: idCliente });

            return rows.map((row: any) => ({
                id: row.id,
                dataInicio: row.dataInicio,
                dataFim: row.dataFim,
                valorFinanciado: row.valorFinanciado,
                taxaJuros: row.taxaJuros,
                taxaJurosAtraso: row.taxaJurosAtraso,
                adicionalDiaAtraso: row.adicionalDiaAtraso,
                valorDiaria: row.valorDiaria,
                valorMontante: row.valorMontante,
                valorPago: row.valorPago,
                modalidade: row.modalidade,
                periodocidade: row.periodocidade,
                totalParcelas: row.totalParcelas,
                finalizado: row.finalizado,
                atrasado: row.atrasado
            }))

        } catch (error) {
            console.error("Erro ao buscar clientes por nome:", error);
            throw error;
        }
    }

    async function buscarParcelasDeFinanciamentoPorId(idFianaciamento:string) {
        try {

            const sql = `SELECT * FROM FINANCIAMENTO_PAGAMENTO f WHERE f.financiamento_id = $financiamento_id ORDER BY f.numeroParcela`

            const rows = await dataBase.getAllAsync(sql, { $financiamento_id: idFianaciamento });

            return rows.map((row: any) => ({
                id: row.id,
                dataVencimento: row.dataVencimento,
                dataPagamento: row.dataPagamento,
                dataUltimoPagamento: row.dataUltimoPagamento,
                numeroParcela: row.numeroParcela,
                valorPago: row.valorPago,
                valorAtual: row.valorAtual,
                valorParcela: row.valorParcela,
                valorDiaria: row.valorDiaria,
                juros: row.juros,
                jurosAtraso: row.jurosAtraso,
                executadoEmpenho: row.executadoEmpenho,
                pagamentoRealizado: row.pagamentoRealizado,
                modalidade: row.modalidade
            }))

        } catch (error) {
            console.error("Erro ao buscar parcela do financiamento: ", error);
            throw error;
        }
    }

    async function buscarParcelaPorId(idParcela: string) {

        const sql = `SELECT * FROM FINANCIAMENTO_PAGAMENTO WHERE id = $idParcela`;

        const row = await dataBase.getFirstAsync<FINANCIAMENTO_PAGAMENTO>(sql, { $idParcela: idParcela });

        if (!row) return null;

        return {
            id: row.id,
            dataVencimento: row.dataVencimento,
            dataPagamento: row.dataPagamento,
            dataUltimoPagamento: row.dataUltimoPagamento,
            numeroParcela: row.numeroParcela,
            valorPago: row.valorPago,
            valorAtual: row.valorAtual,
            valorParcela: row.valorParcela,
            valorDiaria: row.valorDiaria,
            juros: row.juros,
            jurosAtraso: row.jurosAtraso,
            executadoEmpenho: row.executadoEmpenho,
            pagamentoRealizado: row.pagamentoRealizado,
            renegociado: row.renegociado,
            modalidade: row.modalidade
        };
    }

    async function updateParcela(params: {idParcela: string, idFinanciamento: string, parcela: FINANCIAMENTO_PAGAMENTO}) {
        const { idParcela, idFinanciamento, parcela } = params;

        if(parcela.modalidade === MODALIDADE.CarenciaDeCapital){
            return await updateParcelaCarenciaCapital({idParcela: idParcela, idFinanciamento: idFinanciamento, parcela: parcela})  
        }
        
           const sqlFinanciamentoParcela = `
                UPDATE FINANCIAMENTO_PAGAMENTO
                SET 
                    valorPago = COALESCE(valorPago, 0) + $valor,
                    dataPagamento = $dataPagamento,
                    valorAtual = COALESCE(valorAtual, 0) - $valor
                WHERE id = $idParcela
            `;

            const sqlFinanciamento = `
                UPDATE FINANCIAMENTO
                SET valorPago = COALESCE(valorPago, 0) + $valor
                WHERE id = $idFinanciamento
            `

            const sqlFinalizaFinanciamento = `
                UPDATE FINANCIAMENTO
                SET finalizado = 1
                WHERE id = $idFinanciamento 
            `

            const sqlQuantidadeParcelasAtrasadas = `
                SELECT 
                    count(*) as quantAtrasadas
                FROM 
                    FINANCIAMENTO_PAGAMENTO
                WHERE 
                    financiamento_id = $idFinanciamento
                    AND dataPagamento IS NULL
                    AND dataVencimento < datetime('now')
            `
            const sqlQuantidadeParcelasAbertas = `
                SELECT 
                    count(*) as quantAbertas
                FROM 
                    FINANCIAMENTO_PAGAMENTO
                WHERE 
                    financiamento_id = $idFinanciamento
                    AND dataPagamento IS NULL
            `
            const sqlRemoveFlagAtrasadoFinanciamento = `
                UPDATE FINANCIAMENTO
                SET atrasado = 0
                WHERE id = $idFinanciamento 
            `
            

            const statementParcela               = await dataBase.prepareAsync(sqlFinanciamentoParcela);
            const statementFinanciamento         = await dataBase.prepareAsync(sqlFinanciamento);
            const statementRemoveFlagAtrasado    = await dataBase.prepareAsync(sqlRemoveFlagAtrasadoFinanciamento);
            const statementFinalizaFinanciamento = await dataBase.prepareAsync(sqlFinalizaFinanciamento);
            

        await dataBase.execAsync('BEGIN TRANSACTION');
        try {
              
            const returno = await statementParcela.executeAsync({
                $valor: round2(parcela.valorPago),
                $dataPagamento: parcela.dataPagamento?.toString() ?? null,
                $idParcela: idParcela
            });

            await statementFinanciamento.executeAsync({
                $valor: round2(parcela.valorPago),
                $idFinanciamento: idFinanciamento
            });

            const resultAbertas   = await dataBase.getFirstAsync( sqlQuantidadeParcelasAbertas,{ $idFinanciamento: idFinanciamento } ) as { quantAbertas: number };

            if(resultAbertas.quantAbertas <= 0){
                await statementFinalizaFinanciamento.executeAsync({ $idFinanciamento : idFinanciamento })
            }

            const resultAtrasadas = await dataBase.getFirstAsync( sqlQuantidadeParcelasAtrasadas,{ $idFinanciamento: idFinanciamento } ) as { quantAtrasadas: number };
            
            if(resultAtrasadas.quantAtrasadas <= 0 ){
                await statementRemoveFlagAtrasado.executeAsync({ $idFinanciamento : idFinanciamento})
            }

            await dataBase.execAsync('COMMIT');

            return returno;
        } catch (error) {
            await dataBase.execAsync('ROLLBACK');
            alert(`Error ao atualizar cliente: ${error}`);
            throw error;
        } finally {
            await statementParcela.finalizeAsync();
            await statementFinanciamento.finalizeAsync(); 
            await statementFinalizaFinanciamento.finalizeAsync();
           
        }
    }

    async function updateParcelaCarenciaCapital(params: {idParcela: string, idFinanciamento: string, parcela: FINANCIAMENTO_PAGAMENTO}) {
        const { idParcela, idFinanciamento, parcela } = params;
        
        const sqlFinalizaFinanciamento = `
                UPDATE FINANCIAMENTO
                SET finalizado = 1
                WHERE id = $idFinanciamento 
            `
        
        const sqlAtualizarDataVencimentoparcelaCarencia =`
                UPDATE FINANCIAMENTO_PAGAMENTO
                SET 
                    dataVencimento = $dataVencimento, 
                    dataUltimoPagamento = $dataUltimoPagamento, 
                    dataPagamento = $dataPagamento,
                    valorAtual = $valorAtual
                WHERE 
                    id = $idParcela;
            `
        const sqlFinanciamentoCarenciaCapital = `
                UPDATE FINANCIAMENTO_PAGAMENTO
                SET 
                    valorPago = COALESCE(valorPago, 0) + $valor,
                    dataPagamento = $dataPagamento,
                    valorAtual = COALESCE(valorAtual, 0) - $valor
                WHERE id = $idParcela
            `
        
        const sqlQuantidadeParcelasAbertas = `
                SELECT 
                    count(*) as quantAbertas
                FROM 
                    FINANCIAMENTO_PAGAMENTO
                WHERE 
                    financiamento_id = $idFinanciamento
                    AND dataPagamento IS NULL
            `
        
        const sqlFinanciamento = `
                UPDATE FINANCIAMENTO
                SET valorPago = COALESCE(valorPago, 0) + $valor, atrasado = 0
                WHERE id = $idFinanciamento
            `

        const statementFinalizaFinanciamento = await dataBase.prepareAsync(sqlFinalizaFinanciamento);
        const statmentAtualizaDataVencimento = await dataBase.prepareAsync(sqlAtualizarDataVencimentoparcelaCarencia);
        const statementCarenciaCapital       = await dataBase.prepareAsync(sqlFinanciamentoCarenciaCapital)
        const statementFinanciamento         = await dataBase.prepareAsync(sqlFinanciamento);

        await dataBase.execAsync('BEGIN TRANSACTION');
        try {

            let retorno

            const diasEquivalente = Math.floor(round2(parcela.valorPago / parcela.valorDiaria));
            const dataHoje = new Date();
            const dataVencimento = new Date(parcela.dataVencimento);
            dataVencimento.setDate(dataVencimento.getDate() + diasEquivalente); 
            const dataVencimentoOriginal = new Date(parcela.dataVencimento);
            if (dataVencimentoOriginal > dataVencimento) {
                dataVencimento.setTime(dataVencimentoOriginal.getTime());
            }
            const dataUltimoPagamento = dataHoje
            dataUltimoPagamento.setDate(dataUltimoPagamento.getDate() - 1)
            const valorAtual = round2(parcela.valorDiaria)

            const pagouTudo = parcela.valorPago === parcela.valorParcela && (parcela.valorAtual === parcela.valorDiaria || parcela.valorAtual <= 0)
           
            await statementFinanciamento.executeAsync({ $valor: parcela.valorPago, $idFinanciamento: idFinanciamento });

            retorno = await statementCarenciaCapital.executeAsync({
                $valor: round2(parcela.valorPago),
                $dataPagamento: pagouTudo ? new Date().toString() : null,
                $idParcela: idParcela
            });

            if(pagouTudo){
                retorno = await statementFinalizaFinanciamento.executeAsync({ $idFinanciamento : idFinanciamento, $dataPagamento: pagouTudo ? new Date().toISOString() : null  })
                await atualizarValorParcelaCarenciaCapital();
            } else {
                
                await statmentAtualizaDataVencimento.executeAsync({
                    $dataVencimento: dataVencimento.toISOString(),
                    $dataUltimoPagamento: new Date().toISOString(),//dataUltimoPagamento.toISOString(),
                    $valorAtual: valorAtual,
                    $idParcela: idParcela
                })
                
                const resultAbertas   = await dataBase.getFirstAsync( sqlQuantidadeParcelasAbertas,{ $idFinanciamento: idFinanciamento } ) as { quantAbertas: number };

                if(resultAbertas.quantAbertas <= 0){
                    await statementFinalizaFinanciamento.executeAsync({ $idFinanciamento : idFinanciamento })
                }
                await atualizarValorParcelaCarenciaCapital();
            }
            await dataBase.execAsync('COMMIT');
            return retorno
        } catch (error) {
            await dataBase.execAsync('ROLLBACK');
            alert(`Error ao atualizar cliente: ${error}`);
            throw error;
        } finally {
            await statmentAtualizaDataVencimento.finalizeAsync();
            await statementCarenciaCapital.finalizeAsync();
            await statementFinalizaFinanciamento.finalizeAsync();
        }
    }


    async function negociarValorPagamento(params : {idParcela: string, valorAtualNegociado: number}) {
        const {idParcela, valorAtualNegociado } = params

        const sql = `UPDATE FINANCIAMENTO_PAGAMENTO 
            SET valorAtual = $valorAtualNegociado, renegociado = 1
            WHERE id = $idParcela
        `
        const statementNegociacao = await dataBase.prepareAsync(sql);
        try {

            const returno = await statementNegociacao.executeAsync({
                $valorAtualNegociado: valorAtualNegociado,
                $idParcela: idParcela
            });

            return returno;

        } catch (error) {
            alert(`Error ao atualizar Valor atual da Parcela: ${error}`);
            throw error;
        } finally {
            statementNegociacao.finalizeAsync()
        }

    }

    async function atualizarValorParcelaCarenciaCapital(){

            const sql = `UPDATE FINANCIAMENTO_PAGAMENTO
                    SET valorAtual = ROUND(valorDiaria * CAST((julianday('now') - julianday(dataUltimoPagamento)) + 1 AS INTEGER), 2)
                    WHERE 
                        pagamentoRealizado = 0
                        AND modalidade = 'Carência de Capital'`

            const statementCalculoParcelaCarencia = await dataBase.prepareAsync(sql); 

            try {
                const retorno = await statementCalculoParcelaCarencia.executeAsync()
                return true;
            } catch (error) {
                alert(`Error ao atualizar Valor da parcela Carência de Capital: ${error}`);
                throw error;
            } finally {
                await statementCalculoParcelaCarencia.finalizeAsync();
            }
    }

    async function buscarParcelaVencimentoEmDias(quantidadeDiasParaVencer:number) : Promise<FINANCIAMENTO_PAGAMENTO[]> {
            
            const dataInicio = new Date();
            const dataLimite = new Date(dataInicio);
            dataLimite.setDate(dataLimite.getDate() + quantidadeDiasParaVencer);

            const sqlBuscarVencimento = `
                SELECT 
                    fp.id,
                    fp.dataVencimento,
                    fp.dataPagamento,
                    fp.dataUltimoPagamento,
                    fp.numeroParcela,
                    fp.valorPago,
                    fp.valorAtual,
                    fp.valorParcela,
                    fp.valorDiaria,
                    fp.modalidade,
                    fp.juros,
                    fp.jurosAtraso,
                    fp.executadoEmpenho,
                    fp.pagamentoRealizado,
                    fp.renegociado,
                    c.id as idCliente,
                    c.firstName,
                    c.lastName,
                    c.contact,
                    c.photo
                FROM 
                    FINANCIAMENTO_PAGAMENTO fp
                    INNER JOIN FINANCIAMENTO f on f.id = fp.financiamento_id
                    INNER JOIN CUSTOMER c on c.id = fp.cliente_id
                WHERE 
                   fp.dataVencimento >= $dataInicio 
                   and fp.dataVencimento <= $dataLimite
                   and fp.dataPagamento is null
                   and f.finalizado = 0
                ORDER BY
                    fp.dataVencimento DESC
            `

            
            try {

                const rows = await dataBase.getAllAsync<FINANCIAMENTO_PAGAMENTO>(sqlBuscarVencimento, {
                    $dataInicio: dataInicio.toISOString(),
                    $dataLimite: dataLimite.toISOString()
                })

                return rows.map((row: any) => ({
                    id: row.id,
                    dataVencimento: row.dataVencimento,
                    dataPagamento: row.dataPagamento,
                    dataUltimoPagamento: row.dataUltimoPagamento,
                    numeroParcela: row.numeroParcela,
                    valorPago: row.valorPago,
                    valorAtual: row.valorAtual,
                    valorParcela: row.valorParcela,
                    valorDiaria: row.valorDiaria,
                    modalidade: row.modalidade,
                    juros: row.juros,
                    jurosAtraso: row.jurosAtraso,
                    executadoEmpenho: row.executadoEmpenho,
                    pagamentoRealizado: row.pagamentoRealizado,
                    renegociado: row.renegociado,
                    cliente: {
                        id: row.idCliente,
                        firstName: row.firstName,
                        lastName: row.lastName,
                        contact: row.contact,
                        photo: row.photo
                    } as CUSTOMER
                }))

            } catch ( error ){
                alert(`ERROU ${error}`)
                throw error
            } finally {}
    }

        async function buscarParcelaVencidas() : Promise<FINANCIAMENTO_PAGAMENTO[]> {
            
            const dataInicio = new Date();

            const sqlBuscarVencimento = `
                SELECT 
                    fp.id,
                    fp.dataVencimento,
                    fp.dataPagamento,
                    fp.dataUltimoPagamento,
                    fp.numeroParcela,
                    fp.valorPago,
                    fp.valorAtual,
                    fp.valorParcela,
                    fp.valorDiaria,
                    fp.modalidade,
                    fp.juros,
                    fp.jurosAtraso,
                    fp.executadoEmpenho,
                    fp.pagamentoRealizado,
                    fp.renegociado,
                    c.id as idCliente,
                    c.firstName,
                    c.lastName,
                    c.contact,
                    c.photo
                FROM 
                    FINANCIAMENTO_PAGAMENTO fp
                    INNER JOIN FINANCIAMENTO f on f.id = fp.financiamento_id
                    INNER JOIN CUSTOMER c on c.id = fp.cliente_id
                WHERE 
                   fp.dataVencimento < $dataInicio 
                   and fp.dataPagamento is null
                   and f.finalizado = 0
                ORDER BY
                    fp.dataVencimento DESC
            `
            
            try {

                const rows = await dataBase.getAllAsync<FINANCIAMENTO_PAGAMENTO>(sqlBuscarVencimento, {
                    $dataInicio: dataInicio.toISOString(),
                })

                return rows.map((row: any) => ({
                    id: row.id,
                    dataVencimento: row.dataVencimento,
                    dataPagamento: row.dataPagamento,
                    dataUltimoPagamento: row.dataUltimoPagamento,
                    numeroParcela: row.numeroParcela,
                    valorPago: row.valorPago,
                    valorAtual: row.valorAtual,
                    valorParcela: row.valorParcela,
                    valorDiaria: row.valorDiaria,
                    modalidade: row.modalidade,
                    juros: row.juros,
                    jurosAtraso: row.jurosAtraso,
                    executadoEmpenho: row.executadoEmpenho,
                    pagamentoRealizado: row.pagamentoRealizado,
                    renegociado: row.renegociado,
                    cliente: {
                        id: row.idCliente,
                        firstName: row.firstName,
                        lastName: row.lastName,
                        contact: row.contact,
                        photo: row.photo
                    } as CUSTOMER
                }))

            } catch ( error ){
                alert(`ERROU ${error}`)
                throw error
            } finally {}
        }

    async function buscarInvestimentos(): Promise<INVESTIMENTO> {
        const sqlTotalInvestido = `
            SELECT 
                (SELECT COALESCE(SUM(valorFinanciado), 0) FROM FINANCIAMENTO) AS totalInvestido,
                (SELECT COALESCE(SUM(valorMontante), 0) FROM FINANCIAMENTO) AS totalMontante,
                (SELECT COALESCE(SUM(valorPago), 0) FROM FINANCIAMENTO) AS totalRecebido,
                (SELECT COUNT(*) FROM FINANCIAMENTO WHERE finalizado = 1) AS totalFinalizado,
                (SELECT COUNT(*) FROM FINANCIAMENTO WHERE finalizado = 0) AS totalNaoFinalizado,
                (SELECT COUNT(*) FROM FINANCIAMENTO WHERE atrasado = 1) AS totalAtrasado
        `;


        try {
            const row = await dataBase.getFirstAsync<INVESTIMENTO>(sqlTotalInvestido);

            if (!row) {
                throw new Error("Nenhum dado de investimento encontrado.");
            }

            return  {
                totalInvestido: row.totalInvestido,
                totalMontante: row!.totalMontante,
                totalRecebido: row!.totalRecebido,
                totalFinalizado: row!.totalFinalizado,
                totalNaoFinalizado: row!.totalNaoFinalizado,
                totalAtrasado: row!.totalAtrasado
            };


        } catch (error) {
            alert(`ERRO AO BUSCAR TOTAIS INVESTIDOS: ${error}`);
            throw error;
        }
    }

    async function contadorContratosAberto() : Promise <number> {
        
        const sql = "SELECT COUNT(*) as total FROM FINANCIAMENTO WHERE finalizado = 0"

        try{
            const statement = await dataBase.getAllAsync<{total:number}>(sql)
            const count = statement[0]?.total;

            return count
        } catch(error) {
            return 0
        }
    }

    async function contadorContratosAtrasados() : Promise <number> {
        
        const sql = "SELECT COUNT(*) as total FROM FINANCIAMENTO WHERE finalizado = 0 AND atrasado = 1"

        try{
            const statement = await dataBase.getAllAsync<{total:number}>(sql)
            const count = statement[0]?.total;

            return count
        } catch(error) {
            return 0
        }
    }

    return {create,  atualizarPagamentosAtrasados, buscarFinanciamentoPorCliente, buscarParcelasDeFinanciamentoPorId, buscarParcelaPorId, updateParcela, negociarValorPagamento, atualizarValorParcelaCarenciaCapital, buscarParcelaVencimentoEmDias, buscarParcelaVencidas, buscarInvestimentos, contadorContratosAberto, contadorContratosAtrasados }

}