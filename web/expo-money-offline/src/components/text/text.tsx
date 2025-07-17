import { Text } from "react-native";
import { textColorDeactivated, textColorError, textColorPrimary, textColorSecondary, textColorStatusBar, textColorSuccess, textColorWarning } from "../../constants/colorsPalette ";

interface Props {
    text: string
    color: typeof textColorPrimary | typeof textColorSecondary | typeof textColorError | typeof textColorSuccess | typeof textColorWarning | typeof textColorStatusBar | typeof textColorDeactivated
    fontSize: 5 | 7 | 10 | 12 | 14 | 16 | 18 | 20 | 22 | 24 | 26 | 28 | 30
    fontWeight?: "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900"
    textAlign: "left" | "right" | "center" | "justify" | "auto"
    key?: string
    numberOfLines?: number
}
const TextComponent = ( { text, color, fontSize, textAlign, fontWeight, key, numberOfLines } : Props) => {
  return (
    <Text
        key={key}
        numberOfLines={numberOfLines}
        style={{ 
          color: color,
          width: "100%",
          fontSize: fontSize, 
          textAlign: textAlign,
          fontWeight: fontWeight ? fontWeight : "400",
          lineHeight: fontSize * 1.5,
        } }
    >
        {text}
    </Text>
  );
}
export default TextComponent;