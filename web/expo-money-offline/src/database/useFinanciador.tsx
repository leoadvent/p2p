import { useSQLiteContext } from "expo-sqlite";
import { FINANCIADOR } from "../types/financiador";

export function useFinanciadorDataBase() {

    const dataBase = useSQLiteContext();

    async function recuperarFinanciador(): Promise<FINANCIADOR> {

        const sqlConsulta = `SELECT id, firstName, lastName FROM FINANCIADOR`;

        try {
            const row = await dataBase.getFirstAsync<FINANCIADOR>(sqlConsulta);
            return row ?? {} as FINANCIADOR;
        } catch (error) {
            alert("Erro ao recuperar financiador: " + error);
            return {} as FINANCIADOR;
        }
    }

    async function atualizarFinanciador(financiador : FINANCIADOR) {
        const sql = `UPDATE FINANCIADOR SET firstName = ?, lastName = ? WHERE id = ?`
        try{
            await dataBase.runAsync(sql, [
                financiador.firstName,
                financiador.lastName,
                financiador.id
            ])
        }catch (error) {
            alert(`ERROR AO ATUALIZAR FINANCIADOR ${error}`)
        }
    } 

    return { recuperarFinanciador, atualizarFinanciador };
}
