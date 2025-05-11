import { CustomerDTO } from "./customerDTO";

export interface CustomerCommitmentItemDTO {
    id?: string;
    nameItem: string;
    descriptionItem: string;
    valueItem: number;
    warranty: boolean;
    committed: boolean;
    customer: CustomerDTO;
    valueItemFormated?: string;
}