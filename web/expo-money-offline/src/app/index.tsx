import FormularioCustomer from "@/components/formularioCustomer";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Expo Money OFF LINE.</Text>
      <FormularioCustomer />
    </View>
  );
}
