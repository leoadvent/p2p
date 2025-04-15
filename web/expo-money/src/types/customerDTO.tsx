import { Endereco } from "./endereco"

export interface CustomerDTO {
    id: string
    firsName: string
    lastName: string
    contact: string
    Endereco: Endereco
}