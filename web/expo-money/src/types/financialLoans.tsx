import { CustomerDTO } from "./customerDTO"

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
}