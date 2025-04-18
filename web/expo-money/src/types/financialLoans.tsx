import { CustomerDTO } from "./customerDTO"

interface FinancialLoansPaid{
    id: string
    dueDate: Date
    duePayment: Date
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
    lateInterest: number
    dueDay: number
    startMonth: number
    startYear: number
    additionForDaysOfDelay: number
    customer: CustomerDTO
    valueFormat: string
    valueTotalFormat: string
    loansPaids: FinancialLoansPaid[]
}