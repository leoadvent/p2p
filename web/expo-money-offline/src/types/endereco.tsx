export interface ENDERECO {
    id: string | null;
    cep?: string | null;
    logradouro?: string | null;
    numero?: string | null;
    complemento?: string | null;
    bairro?: string | null;
    localidade?: string | null;
    estado?: string | null;
    uf?: string | null;
    regiao?: string | null;
}