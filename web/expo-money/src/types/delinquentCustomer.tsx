import { FinancialLoansPaid } from "./financialLoans"

export interface DelinquentCustomer {
    idClient: string,
    firstName: string,
    lastName: string,
    contact: string
    dueDate: string
    loansPaid: FinancialLoansPaid
    daysOverdue: number
    value: number
    valueFinancialFormat: string
    valueAmountPaid: number
    valueAmountPaidFormat: string
    modalityFinancingDescription: string
}