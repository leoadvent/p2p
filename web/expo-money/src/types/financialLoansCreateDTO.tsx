import { CustomerCommitmentItemDTO } from "./customerCommitmentItemDTO"

export enum ModalityFinancing {
    FINANCING = "PARCELADO",
    ONEROUS_LOAN = "CARÊNCIA DE CAPITAL",
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
    dateEndFinancialOnerousLoans?: Date
    commitmentItems?: CustomerCommitmentItemDTO[]
}