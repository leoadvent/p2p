import { CustomerCommitmentItemDTO } from "./customerCommitmentItemDTO"
import { Endereco } from "./endereco"
import { FinancialLoans } from "./financialLoans"

export interface CustomerDTO {
    id: string
    firsName: string
    lastName: string
    contact: string
    endereco: Endereco
    financialLoans: FinancialLoans[]
    amountFinancialLoans: number
    amountFinancialLoansOpen: number
    amountFinancialLoansPending: number
    amountFinancialLoansExecutedPledge: number
    commitmentItems: CustomerCommitmentItemDTO[]
    photo: string
    photoFile: File
    urlPhoto: string
}