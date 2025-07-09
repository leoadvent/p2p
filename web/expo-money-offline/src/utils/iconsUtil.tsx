import { Ionicons } from "@expo/vector-icons";
import { iconColorDanger, iconColorPrimary, iconColorWarning } from "../constants/colorsPalette ";

interface Props{
    size: 10 | 15 |20
    color: typeof iconColorPrimary | typeof iconColorWarning | typeof iconColorDanger
}
export class IconsUtil {
    static iconTaxa({ size, color } : Props){
        return <Ionicons name='pricetag-outline' color={color} size={size} />
    }

    static contrato({ size, color } : Props ){
        return <Ionicons name='ribbon-outline' color={color} size={size} />
    }

    static cliente({ size, color } : Props ){
        return <Ionicons name='happy-outline' color={color} size={size} />
    }

    static calendarioNumero({ size, color } : Props ){
        return <Ionicons name='calendar-number-outline' color={color} size={size} />
    }

    static dinheiro({ size, color } : Props ){
        return <Ionicons name='cash-outline' color={color} size={size} />
    }
}