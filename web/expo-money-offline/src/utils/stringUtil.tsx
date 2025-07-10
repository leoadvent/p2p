import { FINANCIAMENTO_PAGAMENTO } from "../types/financiamento";
import { DataUtils } from "./dataUtil";

interface PropsMensagemParcelaAtrasada{
        financiamentoPagamento: FINANCIAMENTO_PAGAMENTO,
        idContrato: string,
        nomeCliente: string
    }
export class StringUtil{
    static formatarMoedaReal(valor: string){
        return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    }

    
    static formatarMensagemPagamentoAtrasado({ financiamentoPagamento, idContrato, nomeCliente } : PropsMensagemParcelaAtrasada){
        const message = `👋 Olá ${nomeCliente}, tudo bem?
        💡 Estou entrando em contato para lembrar sobre a *parcela ${financiamentoPagamento.numeroParcela}* referente ao *contrato ${idContrato.slice(0, idContrato.indexOf('-'))}*, com vencimento em *${DataUtils.formatarDataBR(financiamentoPagamento.dataVencimento)}*, que está em atraso há *${DataUtils.calcularDiasEntreDatas(financiamentoPagamento.dataVencimento, new Date())} dias*.

        💰 O valor atualizado está em *${this.formatarMoedaReal(financiamentoPagamento.valorAtual.toString())}*.

        Se tiver qualquer dúvida, estou à disposição! 😊`;
        return message;
    }
}