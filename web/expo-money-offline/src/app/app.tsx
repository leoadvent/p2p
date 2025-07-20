import { SQLiteProvider } from "expo-sqlite";
import { AuhtProvider } from "../context/AuthContext";
import { initializeDataBase } from "../database/initializeDataBase";
import NavigationStack from "../navigation/navigation";

export default function App() {
  return (
    <AuhtProvider>
      <SQLiteProvider databaseName="expo-money-offline.db" onInit={initializeDataBase}>
        <NavigationStack />
      </SQLiteProvider>
    </AuhtProvider>
  );
}
