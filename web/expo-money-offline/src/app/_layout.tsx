import { initializeDataBase } from "@/database/initializeDataBase";
import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";

export default function RootLayout() {

  return (
    <SQLiteProvider databaseName="expo-money-offline.db" onInit={initializeDataBase}>
      <Stack />
    </SQLiteProvider>
);
}
