import { CUSTOMER } from "./customer";

export interface FINANCIAMENTO_PAGAMENTO {
    id: string
    dataVencimento: Date
    dataPagamento: Date
    numeroParcela: number
    valorPago: number
    valorAtual: number
    valorDiaria: number
    juros: number
    jurosAtraso: number
    executadoEmpenho: boolean
    cliente: CUSTOMER
}

export interface FINANCIAMENTO {
    id: string
    dataInicio: Date // YYYY-MM-DD
    dataFim: Date // YYYY-MM-DD
    valorFinanciado: number // Valor total financiado
    taxaJuros: number // Taxa de juros anual
    taxaJurosAtraso: number // Taxa de juros de atraso anual
    valorDiaria: number // Valor da diária, opcional
    modalidade: string // Modalidade do financiamento, padrão: 'Parcelado, Carência de Capital'
    totalParcelas: number
    cliente: CUSTOMER // ID do cliente associado ao financiamento
    pagamentos: FINANCIAMENTO_PAGAMENTO[] // Lista de pagamentos associados ao financiamento
}