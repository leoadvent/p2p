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
            regiao TEXT NULL,
        );
        `)

    await dataBase.execAsync(`
        CREATE TABLE IF NOT EXISTS CUSTOMER (
            id TEXT PRIMARY KEY,
            firstName TEXT NOT NULL,
            lastName TEXT NOT NULL UNIQUE,
            contact TEXT NOT NULL UNIQUE,
            photo TEXT NOT NULL,
            endereco_id TEXT,
            FOREIGN KEY (endereco_id) REFERENCES ENDERECO(id)
        );
        `)

}