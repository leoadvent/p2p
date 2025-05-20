import { Modal } from "react-native"
import { CustomerDTO } from "./customerDTO"
import { ModalityFinancing } from "./financialLoansCreateDTO"
import { CustomerCommitmentItemDTO } from "./customerCommitmentItemDTO"

export interface FinancialLoansPaid{
    id: string
    portion: number
    dueDate: string
    duePayment: string
    installmentValue: number
    currencyValue: number
    currencyValueFormat: string
    amountPaid: number
    additionForDaysOfDelay: number
    additionForDaysOfDelayFormat: string
    rate: number
    interestDelay: number
    amountPaidFormat: string
    installmentValueFormat: string
    lateInstallment: boolean
    debitBalance: string
    renegotiation: boolean
    renegotiationDate: string
    valueDiaryFormat: string
    valueDiary: number
    amountPaidOnerous: number
    amountPaidOnerousFormat: string
    daysOverdue: number
}

export interface FinancialLoans {
    id: string
    value: number
    rate: number
    rates: string
    lateInterest: number
    cashInstallment: number
    dueDay: number
    startMonth: number
    startYear: number
    additionForDaysOfDelay: number
    additionForDaysOfDelayFormat: string
    customer: CustomerDTO
    valueFormat: string
    valueTotalFormat: string
    loansPaids: FinancialLoansPaid[]
    totalInstallmentPending: number
    modalityFinancing: ModalityFinancing
    modalityFinancingFormating: string
    dateEndFinancialOnerousLoans: Date
    commitmentItems: CustomerCommitmentItemDTO[]
}