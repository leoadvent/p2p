export interface FinancialLoansCreateDTO {
    value: number
    rate: number
    lateInterest: number
    startDateDue: Date
    cashInstallment: number
    customerId: string
    simulator: boolean
    additionForDaysOfDelay: number
}