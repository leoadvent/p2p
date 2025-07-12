import { useSQLiteContext } from 'expo-sqlite';
import uuid from 'react-native-uuid';
import { FINANCIAMENTO, FINANCIAMENTO_PAGAMENTO, MODALIDADE } from '../types/financiamento';
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
                AND DATE(fp.dataVencimento) < DATE('now');
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
                    valorAtual = $valorAtual
                WHERE 
                    id = $idParcela;
            `

            const statementParcela               = await dataBase.prepareAsync(sqlFinanciamentoParcela);
            const statementFinanciamento         = await dataBase.prepareAsync(sqlFinanciamento);
            const statementRemoveFlagAtrasado    = await dataBase.prepareAsync(sqlRemoveFlagAtrasadoFinanciamento);
            const statementFinalizaFinanciamento = await dataBase.prepareAsync(sqlFinalizaFinanciamento);
            const statmentAtualizaDataVencimento = await dataBase.prepareAsync(sqlAtualizarDataVencimentoparcelaCarencia);

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

            

           if(parcela.modalidade === MODALIDADE.CarenciaDeCapital){

                if(parcela.valorPago === parcela.valorParcela){
                    await statementFinalizaFinanciamento.executeAsync({ $idFinanciamento : idFinanciamento })
                } else {
                    const diasEquivalente = Math.floor(round2(parcela.valorPago / parcela.valorAtual));
                    const dataHoje = new Date();
                    const dataVencimento = new Date(dataHoje);
                    dataVencimento.setDate(dataVencimento.getDate() + diasEquivalente); 
                    if(parcela.dataVencimento > dataVencimento){
                        dataVencimento.setDate(parcela.dataVencimento.getDate())
                    }
                    const dataUltimoPagamento = dataHoje
                    const valorAtual = round2(parcela.valorDiaria)
                    await statmentAtualizaDataVencimento.executeAsync({
                        $dataVencimento: dataVencimento.toString(),
                        $dataUltimoPagamento: dataUltimoPagamento.toString(),
                        $valorAtual: valorAtual,
                        $idParcela: idParcela
                    })
                    const returno = await statementParcela.executeAsync({
                        $valor: round2(parcela.valorPago),
                        $dataPagamento: null,
                        $idParcela: idParcela
                    });

                }
                return

            } else {

                const resultAbertas   = await dataBase.getFirstAsync( sqlQuantidadeParcelasAbertas,{ $idFinanciamento: idFinanciamento } ) as { quantAbertas: number };

                if(resultAbertas.quantAbertas <= 0){
                    await statementFinalizaFinanciamento.executeAsync({ $idFinanciamento : idFinanciamento })
                }

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
            await statmentAtualizaDataVencimento.finalizeAsync();
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
                    SET valorAtual = ROUND(valorDiaria * CAST(julianday('now') - julianday(dataUltimoPagamento) AS INTEGER), 2)
                    WHERE 
                        pagamentoRealizado = 0
                        AND modalidade = 'Carência de Capital'
                        AND dataUltimoPagamento IS NOT NULL;`

            const statementCalculoParcelaCarencia = await dataBase.prepareAsync(sql); 

            try {
                await statementCalculoParcelaCarencia.executeAsync()
                return true;
            } catch (error) {
                alert(`Error ao atualizar Valor da parcela Carência de Capital: ${error}`);
                throw error;
            } finally {
                statementCalculoParcelaCarencia.finalizeAsync();
            }
        }


    return {create,  atualizarPagamentosAtrasados, buscarFinanciamentoPorCliente, buscarParcelasDeFinanciamentoPorId, buscarParcelaPorId, updateParcela, negociarValorPagamento, atualizarValorParcelaCarenciaCapital }

}