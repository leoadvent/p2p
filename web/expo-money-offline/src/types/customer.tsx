import { ENDERECO } from "./endereco";

export interface CUSTOMER {
    id: string;
    firstName: string;
    lastName: string;
    contact: string;
    photo: string;
    endereco: ENDERECO;
    totalParcelasAbertas: number
    totalParcelasAtrasadas: number
    totalParcelasPendente: number
    totalFinanciamentoFechado: number
}