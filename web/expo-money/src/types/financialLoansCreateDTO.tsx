import { CustomerCommitmentItemDTO } from "./customerCommitmentItemDTO"

export enum ModalityFinancing {
    FINANCING = "Financiamento",
    ONEROUS_LOAN = "Mútuo Oneroso",
}

export interface FinancialLoansCreateDTO {
    value: number
    rate: number
    lateInterest: number
    startDateDue: Date
    cashInstallment: number
    customerId: string
    simulator: boolean
    additionForDaysOfDelay: number
    modalityFinancing: ModalityFinancing | string
    onerousLoanValue?: number
    commitmentItems?: CustomerCommitmentItemDTO[]
}