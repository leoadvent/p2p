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

    async function buscarPorNome(nome:string) {
        try {
            let firstName = `%${nome}%`;
            let lastName = `%${nome}%`;

            const response = dataBase.getAllAsync<CUSTOMER>(`
                SELECT 
                    * 
                FROM 
                    CUSTOMER c
                    LEFT JOIN ENDERECO e ON c.endereco_id = e.id
                WHERE firstName LIKE '%${firstName}%' OR lastName LIKE '%${lastName}%'`);

                console.log("buscarPorNome - response", response);
                return response;
        }catch (error) {
            console.error("Error:", error);
            throw error;
        }
    }

    return {create, buscarPorNome}
}