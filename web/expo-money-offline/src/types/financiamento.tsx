import { CUSTOMER } from "./customer";

export enum PERIODOCIDADE {
    Semanal = "Semanal",
    Quinzenal = "Quinzenal",
    Mensal = "Mensal"
}

export enum MODALIDADE {
    Parcelado = "Parcelado",
    CarenciaDeCapital = "Carência de Capital"
}

export interface FINANCIAMENTO_PAGAMENTO {
    id: string
    dataVencimento: Date
    dataPagamento: Date | null
    dataUltimoPagamento: Date
    numeroParcela: number
    valorPago: number
    valorAtual: number
    valorParcela: number
    valorDiaria: number
    valorEmpenho: number
    modalidade: MODALIDADE // Modalidade do financiamento, padrão: 'Parcelado, Carência de Capital'
    juros: number
    jurosAtraso: number
    executadoEmpenho: boolean
    pagamentoRealizado: boolean
    renegociado: boolean
    empenhoExecutado: boolean
    cliente: CUSTOMER
}

export interface FINANCIAMENTO {
    id: string
    dataInicio: Date // YYYY-MM-DD
    dataFim: Date // YYYY-MM-DD
    valorFinanciado: number // Valor total financiado
    taxaJuros: number // Taxa de juros anual
    taxaJurosAtraso: number // Taxa de juros de atraso anual
    adicionalDiaAtraso: number
    valorDiaria: number // Valor da diária, opcional
    valorMontante: number  // Valor do montante
    valorPago: number
    modalidade: MODALIDADE // Modalidade do financiamento, padrão: 'Parcelado, Carência de Capital'
    periodocidade: PERIODOCIDADE
    totalParcelas: number
    finalizado: boolean
    atrasado: boolean
    cliente: CUSTOMER // ID do cliente associado ao financiamento
    pagamentos: FINANCIAMENTO_PAGAMENTO[] // Lista de pagamentos associados ao financiamento
}