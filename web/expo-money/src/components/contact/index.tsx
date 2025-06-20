import { Alert, Linking, TouchableOpacity, View } from "react-native";
import TextComponent from "../text/text";
import { buttonBackgroundColorCall, buttonBackgroundColorWhatssapp, textColorPrimary, textColorSecondary, textColorWarning } from "@/src/constants/colorsPalette ";
import { Ionicons } from "@expo/vector-icons";

interface Props {
    phoneNumber: string
    message?: string
    showText?: boolean
  }
const Contact = ({ phoneNumber, message = "Olá!", showText = true }: Props) => {

    const openWhatsApp = async () => {
        const url = `https://wa.me/${phoneNumber.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
        const supported = await Linking.canOpenURL(url);
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert("Erro", "WhatsApp não está instalado ou o número é inválido.");
        }
    };

    const makeCall = async () => {
        const url = `tel:${phoneNumber}`;
        const supported = await Linking.canOpenURL(url);
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert("Erro", "Não foi possível iniciar a ligação.");
        }
      };

      return (
        <View style={{ flexDirection: "row", gap: 10 }}>
            <TouchableOpacity
                onPress={openWhatsApp}
                style={{ display:"flex", flexDirection:"row", gap:10, padding: 10, backgroundColor: buttonBackgroundColorWhatssapp, borderRadius: 5 }}
            >
                <Ionicons name="logo-whatsapp" size={15} color={textColorSecondary}/>
                {showText && <TextComponent text={"WhatsApp"} color={textColorPrimary} fontSize={10} textAlign={"auto"} />}
            </TouchableOpacity>

            <TouchableOpacity
                onPress={makeCall}
                style={{ display:"flex", flexDirection:"row", gap:10, padding: 10, backgroundColor: buttonBackgroundColorCall, borderRadius: 5 }}
            >
                <Ionicons name="call-outline" size={15} color={textColorWarning}/>
                {showText && <TextComponent text={"Ligar"} color={textColorPrimary} fontSize={10} textAlign={"auto"} />}
            </TouchableOpacity>
        </View>
      )

}
export default Contact;