import { type SQLiteDatabase } from 'expo-sqlite';

export async function initializeDataBase(dataBase: SQLiteDatabase) {

    await dataBase.execAsync(`
        CREATE TABLE IF NOT EXISTS ENDERECO (
            id TEXT PRIMARY KEY,
            cep TEXT NULL,
            logradouro TEXT NULL,
            numero TEXT NULL,
            complemento TEXT NULL,
            bairro TEXT NULL,
            localidade TEXT NULL,
            estado TEXT NULL,
            uf TEXT NULL,
            regiao TEXT NULL
        )
        `)

    await dataBase.execAsync(`
        CREATE TABLE IF NOT EXISTS CUSTOMER (
            id TEXT PRIMARY KEY,
            firstName TEXT NOT NULL,
            lastName TEXT NOT NULL,
            contact TEXT NULL,
            photo TEXT NULL,
            endereco_id TEXT,
            FOREIGN KEY (endereco_id) REFERENCES ENDERECO(id)
        )
    `)
    
    await dataBase.execAsync(`
        CREATE TABLE IF NOT EXISTS FINANCIAMENTO (
            id TEXT PRIMARY KEY NOT NULL,
            dataInicio TEXT NOT NULL, -- formato ISO: YYYY-MM-DD
            dataFim TEXT NOT NULL,
            valorFinanciado REAL NOT NULL,
            taxaJuros REAL NOT NULL,
            taxaJurosAtraso REAL NOT NULL,
            valorDiaria REAL,
            modalidade TEXT NOT NULL DEFAULT 'Parcelado, Carência de Capital',
            totalParcelas INTEGER NOT NULL,
            cliente_id TEXT,
            FOREIGN KEY (cliente_id) REFERENCES CUSTOMER(id)
        );
    `);

    await dataBase.execAsync(`
        CREATE TABLE IF NOT EXISTS FINANCIAMENTO_PAGAMENTO (
            id TEXT PRIMARY KEY NOT NULL,
            dataVencimento TEXT NOT NULL,
            dataPagamento TEXT,
            numeroParcela INTEGER NOT NULL,
            valorPago REAL,
            valorAtual REAL,
            valorDiaria REAL,
            juros REAL NOT NULL,
            jurosAtraso REAL NOT NULL,
            executadoEmpenho INTEGER, -- BOOLEAN representado como INTEGER
            cliente_id TEXT,
            financiamento_id TEXT,
            FOREIGN KEY (cliente_id) REFERENCES CUSTOMER(id),
            FOREIGN KEY (financiamento_id) REFERENCES FINANCIAMENTO(id)
        );
    `);

}