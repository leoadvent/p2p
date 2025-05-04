import { FinancialLoansPaid } from "./financialLoans"

export interface CustomerDueToday {
    idCustomer: string
    contact: string
    firstname: string
    lastName: string
    paid: FinancialLoansPaid
}