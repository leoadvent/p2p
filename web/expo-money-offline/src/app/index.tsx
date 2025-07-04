import FormularioCustomer from "@/components/formularioCustomer";
import ListarCliente from "@/components/listarCliente";
import { ScrollView, Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
      <Text>Expo Money OFF LINE.</Text>
      <ListarCliente />
      <FormularioCustomer />
      </ScrollView>
    </View>
  );
}
