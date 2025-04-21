import { CustomerDTO } from "./customerDTO"

export interface FinancialLoansPaid{
    id: string
    portion: number
    dueDate: string
    duePayment: string
    installmentValue: number
    amountPaid: number
    additionForDaysOfDelay: number
    rate: number
    interestDelay: number
    amountPaidFormat: string
    installmentValueFormat: string
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