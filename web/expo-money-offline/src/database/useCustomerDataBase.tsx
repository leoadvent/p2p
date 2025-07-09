import { CUSTOMER } from '@/types/customer';
import { useSQLiteContext } from 'expo-sqlite';
import uuid from 'react-native-uuid';

export function useCustomerDataBase() {

    const dataBase = useSQLiteContext();

    async function create(customer: Omit<CUSTOMER, 'id'>){

        const idEndereco  = uuid.v4();
        const idECustomer = uuid.v4();

        const sqlEndereco = `
            INSERT INTO ENDERECO (id, cep, logradouro, numero, complemento, bairro, localidade, estado, uf, regiao)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const sqlCustomer = `
            INSERT INTO CUSTOMER (id, firstName, lastName, contact, photo, endereco_id)
            VALUES (?, ?, ?, ?, ?, ?)  
        `;

        const statementEndereco = await dataBase.prepareAsync(sqlEndereco);
        const statementCustomer = await dataBase.prepareAsync(sqlCustomer);

        try {

            const resultEndereco = await statementEndereco.executeAsync([
                idEndereco,
                customer.endereco?.cep ?? null,
                customer.endereco?.logradouro ?? null,
                customer.endereco?.numero ?? null,
                customer.endereco?.complemento ?? null,
                customer.endereco?.bairro ?? null,
                customer.endereco?.localidade ?? null,
                customer.endereco?.estado ?? null,
                customer.endereco?.uf ?? null,
                customer.endereco?.regiao ?? null
            ])

            customer.endereco = {
                ...customer.endereco,
                id: idEndereco
            };

            const resultCustomer = await statementCustomer.executeAsync([
                idECustomer,
                customer.firstName,
                customer.lastName,
                customer.contact,
                customer.photo,
                idEndereco
            ]);

             const insertedId = resultCustomer.lastInsertRowId.toString();

             return {insertedId, customer: {...customer, id: idECustomer}};
                        
        }catch (error) {
            console.error("Error ao criar CUSTOMER:", error);
            throw error;
        } finally {
            await statementCustomer.finalizeAsync();
            await statementEndereco.finalizeAsync();
        }
    }

    async function buscarPorNome(nome: string): Promise<CUSTOMER[]> {
        try {
            const likeNome = `%${nome}%`;

           const sql = `
            SELECT 
                c.id as cliente_id,
                c.firstName,
                c.lastName,
                c.contact,
                c.photo,
                e.id as endereco_id,
                e.cep,
                e.logradouro,
                e.numero,
                e.complemento,
                e.bairro,
                e.localidade,
                e.estado,
                e.uf,
                e.regiao,
                (SELECT COUNT(*) FROM FINANCIAMENTO f WHERE f.cliente_id = c.id AND f.finalizado = 0 AND f.atrasado = 0) as totalFinanciamentoAbertas,
                (SELECT COUNT(*) FROM FINANCIAMENTO f WHERE f.cliente_id = c.id AND f.finalizado = 0 AND f.atrasado = 1) as totalParcelasAtrasadas,
                (SELECT COUNT(*) FROM FINANCIAMENTO f WHERE f.cliente_id = c.id AND f.finalizado = 0) as totalParcelasPendente
            FROM 
                CUSTOMER c
                LEFT JOIN ENDERECO e ON c.endereco_id = e.id
            WHERE 
                c.firstName LIKE $nome OR c.lastName LIKE $nome
            ORDER BY 
                totalParcelasAtrasadas, totalFinanciamentoAbertas DESC
            `;


            const rows = await dataBase.getAllAsync(sql, { $nome: likeNome });

            // Mapear os dados para a interface CUSTOMER
            return rows.map((row: any) => ({
            id: row.id,
            firstName: row.firstName,
            lastName: row.lastName,
            contact: row.contact,
            photo: row.photo,
            totalParcelasAbertas: row.totalFinanciamentoAbertas,
            totalParcelasAtrasadas: row.totalParcelasAtrasadas,
            totalParcelasPendente: row.totalParcelasPendente,
            endereco: {
                id: row.endereco_id,
                cep: row.cep,
                logradouro: row.logradouro,
                numero: row.numero,
                complemento: row.complemento,
                bairro: row.bairro,
                localidade: row.localidade,
                estado: row.estado,
                uf: row.uf,
                regiao: row.regiao,
            },
            }));
        } catch (error) {
            console.error("Erro ao buscar clientes por nome:", error);
            throw error;
        }
    }


    async function updateCliente(cliente: CUSTOMER) {
        
        const sql = `
            UPDATE CUSTOMER 
            SET firstName = $firstName, lastName = $lastName, contact = $contact, photo = $photo
            WHERE id = $id
        `;

        const statement = await dataBase.prepareAsync(sql);
        try {
            const result = await statement.executeAsync({
                $firstName: cliente.firstName,
                $lastName: cliente.lastName,
                $contact: cliente.contact,
                $photo: cliente.photo,
                $id: cliente.id
            });
            return result;
        } catch (error) {
            console.error("Error ao atualizar cliente:", error);
            throw error;
        } finally {
            await statement.finalizeAsync();
        }
        
    }

    return {create, buscarPorNome, updateCliente}
}