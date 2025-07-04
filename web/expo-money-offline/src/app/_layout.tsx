import { initializeDataBase } from "@/database/initializeDataBase";
import { Slot } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";

export default function Layout() {

  return (
    <SQLiteProvider databaseName="expo-money-offline.db" onInit={initializeDataBase}>
      <Slot />
    </SQLiteProvider>
);
}
