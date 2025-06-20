import { Text } from "react-native";
import { textColorError, textColorPrimary, textColorSecondary, textColorSuccess, textColorWarning } from "../../constants/colorsPalette ";

interface Props {
    text: string
    color: typeof textColorPrimary | typeof textColorSecondary | typeof textColorError | typeof textColorSuccess | typeof textColorWarning
    fontSize: 7 | 10 | 12 | 14 | 16 | 18 | 20 | 22 | 24 | 26 | 28 | 30
    fontWeight?: "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900"
    textAlign: "left" | "right" | "center" | "justify" | "auto"
    key?: string
}
const TextComponent = ( { text, color, fontSize, textAlign, fontWeight, key } : Props) => {
  return (
    <Text
        key={key}
        style={{ 
          color: color, 
          fontSize: fontSize, 
          textAlign: textAlign,
          fontWeight: fontWeight ? fontWeight : "400",
          lineHeight: fontSize * 1.5
        } }
    >
        {text}
    </Text>
  );
}
export default TextComponent;