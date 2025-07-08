import { useSQLiteContext } from 'expo-sqlite';
import uuid from 'react-native-uuid';
import { FINANCIAMENTO } from '../types/financiamento';

export function useFinanciamentoDataBase() {
    
    const dataBase = useSQLiteContext();

    async function create (financiamento: Omit<FINANCIAMENTO, 'id'>){

        const idFinanciamento  = uuid.v4();

        const sqlFinanciamento = `
            INSERT INTO FINANCIAMENTO ( 
                id, dataInicio, dataFim, valorFinanciado,taxaJuros, taxaJurosAtraso, adicionalDiaAtraso,valorDiaria, modalidade, totalParcelas, finalizado, atrasado, cliente_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

        const sqlFinanciamentoPagament = `
            INSERT INTO FINANCIAMENTO_PAGAMENTO (
                id, dataVencimento, dataPagamento, numeroParcela, valorPago, valorAtual, valorDiaria, juros, jurosAtraso, executadoEmpenho, cliente_id, financiamento_id  
            ) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const statementFinanciamento          = await dataBase.prepareAsync(sqlFinanciamento);
        const statementFinanciamentoPagamento = await dataBase.prepareAsync(sqlFinanciamentoPagament);

        try {

            const resultFinanciamento = await statementFinanciamento.executeAsync([
                idFinanciamento,
                financiamento.dataInicio instanceof Date ? financiamento.dataInicio.toISOString() : financiamento.dataInicio,
                financiamento.dataFim instanceof Date ? financiamento.dataFim.toISOString() : financiamento.dataFim,
                financiamento.valorFinanciado,
                financiamento.taxaJuros,
                financiamento.adicionalDiaAtraso,
                financiamento.taxaJurosAtraso,
                financiamento.valorDiaria,
                financiamento.modalidade,
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

    return {create}
}