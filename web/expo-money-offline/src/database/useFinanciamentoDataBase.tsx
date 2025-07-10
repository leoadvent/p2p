import { useSQLiteContext } from 'expo-sqlite';
import uuid from 'react-native-uuid';
import { FINANCIAMENTO } from '../types/financiamento';
import { TIPOFINANCIAMENTO } from '../types/tiposFinanciamento';

export function useFinanciamentoDataBase() {
    
    const dataBase = useSQLiteContext();

    async function create (financiamento: Omit<FINANCIAMENTO, 'id'>){

        const idFinanciamento  = uuid.v4();

        const sqlFinanciamento = `
            INSERT INTO FINANCIAMENTO ( 
                id, dataInicio, dataFim, valorFinanciado,taxaJuros, taxaJurosAtraso, adicionalDiaAtraso,valorDiaria, valorMontante, valorPago, modalidade, periodocidade, totalParcelas, finalizado, atrasado, cliente_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

        const sqlFinanciamentoPagament = `
            INSERT INTO FINANCIAMENTO_PAGAMENTO (
                id, dataVencimento, dataPagamento, numeroParcela, valorPago, valorAtual, valorParcela, valorDiaria, juros, jurosAtraso, executadoEmpenho, cliente_id, financiamento_id  
            ) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const statementFinanciamento          = await dataBase.prepareAsync(sqlFinanciamento);
        const statementFinanciamentoPagamento = await dataBase.prepareAsync(sqlFinanciamentoPagament);

        try {

            const resultFinanciamento = await statementFinanciamento.executeAsync([
                idFinanciamento,
                financiamento.dataInicio instanceof Date ? financiamento.dataInicio.toISOString() : financiamento.dataInicio,
                financiamento.dataFim instanceof Date ? financiamento.dataFim.toISOString() : financiamento.dataFim,
                financiamento.valorFinanciado,
                financiamento.taxaJuros,
                financiamento.taxaJurosAtraso,
                financiamento.adicionalDiaAtraso,
                financiamento.valorDiaria,
                financiamento.valorMontante,
                financiamento.valorPago,
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

                await statementFinanciamentoPagamento.executeAsync([
                idPagamento,
                item.dataVencimento instanceof Date ? item.dataVencimento.toISOString() : item.dataVencimento,
                item.dataPagamento ? (item.dataPagamento instanceof Date ? item.dataPagamento.toISOString() : item.dataPagamento) : null,
                item.numeroParcela,
                item.valorPago ?? 0,
                item.valorAtual ?? 0,
                item.valorParcela ?? 0,
                item.valorDiaria ?? 0,
                item.juros,
                item.jurosAtraso,
                item.executadoEmpenho ? 1 : 0,
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
                    COALESCE(fp.valorDiaria, 0) + 
                    ((julianday('now') - julianday(fp.dataVencimento)) * COALESCE(f.adicionalDiaAtraso, 0)), 
                    2
                    )
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
            return false;
        }
    }

    async function  buscarFinanciamentoPorCliente(idCliente:string, tipo: TIPOFINANCIAMENTO) {
        try {
            
            let sql = `
                SELECT * FROM FINANCIAMENTO f WHERE f.cliente_id = $cliente_id
            `
            let filtro = ' AND f.finalizado = 0 '

            if(tipo === TIPOFINANCIAMENTO.aberto){
                filtro += ' AND f.atrasado = 0'
            }else if(tipo === TIPOFINANCIAMENTO.atrasado) {
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
                numeroParcela: row.numeroParcela,
                valorPago: row.valorPago,
                valorAtual: row.valorAtual,
                valorParcela: row.valorParcela,
                valorDiaria: row.valorDiaria,
                juros: row.juros,
                jurosAtraso: row.jurosAtraso,
                executadoEmpenho: row.executadoEmpenho
            }))

        } catch (error) {
            console.error("Erro ao buscar parcela do financiamento: ", error);
            throw error;
        }
    }

    return {create,  atualizarPagamentosAtrasados, buscarFinanciamentoPorCliente, buscarParcelasDeFinanciamentoPorId }

}