import { CustomerDTO } from "./customerDTO";
import { FinancialLoans } from "./financialLoans";

export interface FinancialLoansPendingByCustumerDTO {
    customer: CustomerDTO
    loansPendingDTOS: FinancialLoans[]
}