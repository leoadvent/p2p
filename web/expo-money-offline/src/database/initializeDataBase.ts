import { type SQLiteDatabase } from 'expo-sqlite';

export async function initializeDataBase(dataBase: SQLiteDatabase) {

    //await dataBase.execAsync(`DROP TABLE IF EXISTS FINANCIAMENTO;`);
    //await dataBase.execAsync(`DROP TABLE IF EXISTS FINANCIAMENTO_PAGAMENTO;`);
    //await dataBase.execAsync(`DROP TABLE IF EXISTS ENDERECO;`);
    //await dataBase.execAsync(`DROP TABLE IF EXISTS CUSTOMER;`);
    //await dataBase.execAsync(`DROP TABLE IF EXISTS FINANCIADOR;`);

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
            adicionalDiaAtraso REAL NOT NULL,
            valorDiaria REAL,
            valorMontante REAL,
            valorPago REAL,
            valorEmpenho REAL,
            modalidade TEXT NOT NULL,
            periodocidade TEXT NOT NULL DEFAULT 'Semanal, Quinzenal, Mensal',
            totalParcelas INTEGER NOT NULL,
            finalizado INTEGER NULL,
            atrasado INTEGER NULL,
            empenhoExecutado,
            cliente_id TEXT,
            FOREIGN KEY (cliente_id) REFERENCES CUSTOMER(id)
        );
    `);

    await dataBase.execAsync(`
        CREATE TABLE IF NOT EXISTS FINANCIAMENTO_PAGAMENTO (
            id TEXT PRIMARY KEY NOT NULL,
            dataVencimento TEXT NOT NULL,
            dataPagamento TEXT,
            dataUltimoPagamento TEXT,
            numeroParcela INTEGER NOT NULL,
            valorPago REAL,
            valorAtual REAL,
            valorParcela REAL,
            valorDiaria REAL,
            juros REAL NOT NULL,
            jurosAtraso REAL NOT NULL,
            modalidade TEXT NOT NULL,
            executadoEmpenho INTEGER, -- BOOLEAN representado como INTEGER
            pagamentoRealizado INTEGER, -- BOOLEAN representado como INTEGER
            renegociado INTEGER NULL,
            cliente_id TEXT,
            financiamento_id TEXT,
            FOREIGN KEY (cliente_id) REFERENCES CUSTOMER(id),
            FOREIGN KEY (financiamento_id) REFERENCES FINANCIAMENTO(id)
        );
    `);

    await dataBase.execAsync(`
        CREATE TABLE IF NOT EXISTS FINANCIADOR (
            id TEXT PRIMARY KEY NOT NULL,
            firstName TEXT NOT NULL,
            lastName TEXT NOT NULL
        )
    `)

    await dataBase.execAsync(`
        INSERT OR IGNORE INTO FINANCIADOR (id, firstName, lastName)
            VALUES ('1', 'Meu Nome', 'Meu Sobrenome');
    `)

    await dataBase.execAsync(`CREATE INDEX IF NOT EXISTS idx_financiamento_cliente ON FINANCIAMENTO(cliente_id)`);
    await dataBase.execAsync(`CREATE INDEX IF NOT EXISTS idx_pagamento_cliente ON FINANCIAMENTO_PAGAMENTO(cliente_id)`);
    await dataBase.execAsync(`CREATE INDEX IF NOT EXISTS idx_pagamento_financiamento ON FINANCIAMENTO_PAGAMENTO(financiamento_id)`);
    await dataBase.execAsync(`CREATE INDEX IF NOT EXISTS idx_pagamento_dataVencimento ON FINANCIAMENTO_PAGAMENTO(dataVencimento)`);
}