import { SQLiteProvider } from "expo-sqlite";
import { initializeDataBase } from "../database/initializeDataBase";
import NavigationStack from "../navigation/navigation";

export default function App() {
  return (
      <SQLiteProvider databaseName="expo-money-offline.db" onInit={initializeDataBase}>
        <NavigationStack />
      </SQLiteProvider>
  );
}
