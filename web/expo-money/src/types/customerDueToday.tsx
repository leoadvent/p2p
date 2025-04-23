import { FinancialLoansPaid } from "./financialLoans"

export interface CustomerDueToday {
    idCustomer: string
    firstname: string
    lastName: string
    paid: FinancialLoansPaid
}