import { buttonBackgroundColorCall, buttonBackgroundColorWhatssapp, iconColorPrimary, textColorPrimary } from "@/src/constants/colorsPalette ";
import { IconsUtil } from "@/src/utils/iconsUtil";
import { Linking, TouchableOpacity, View } from "react-native";
import TextComponent from "../text/text";

interface Props {
    telefoneNumero: string
    mensagem?: string
    exibeTexto?: boolean
  }

const Contato = ({ telefoneNumero, mensagem = "Olá!", exibeTexto} : Props) => {
    const abriWhatsapp = async () => {
        const url = `https://wa.me/${telefoneNumero.replace(/\D/g, "")}?text=${encodeURIComponent(mensagem)}`;
        const supported = await Linking.canOpenURL(url);
        if (supported) {
          Linking.openURL(url);
        } else {
          alert("WhatsApp não está instalado ou o número é inválido.");
        }
    };

    const telefonar = async () => {
        const url = `tel:${telefoneNumero}`;
        const supported = await Linking.canOpenURL(url);
        if (supported) {
          Linking.openURL(url);
        } else {
          alert("Não foi possível iniciar a ligação.");
        }
      };

    return (
        <View style={{ flexDirection: "row", gap: 10 }}>
            <TouchableOpacity
                onPress={abriWhatsapp}
                style={{ display:"flex", flexDirection:"row", gap:10, padding: 10, width: 55, height: 55, backgroundColor: buttonBackgroundColorWhatssapp, borderRadius: 5 }}
            >
                {IconsUtil.whatsApp({size: 30, color: iconColorPrimary})}
                {exibeTexto && <TextComponent text={"WhatsApp"} color={textColorPrimary} fontSize={10} textAlign={"auto"} />}
            </TouchableOpacity>

            <TouchableOpacity
                onPress={telefonar}
                style={{ display:"flex", flexDirection:"row", gap:10, padding: 10, width: 55, height: 55, backgroundColor: buttonBackgroundColorCall, borderRadius: 5 }}
            >
                {IconsUtil.telefonar({size: 30, color: iconColorPrimary})}
                {exibeTexto && <TextComponent text={"Ligar"} color={textColorPrimary} fontSize={10} textAlign={"auto"} />}
            </TouchableOpacity>
        </View>
      )

}
export default Contato