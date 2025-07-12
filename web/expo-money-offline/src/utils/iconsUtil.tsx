import { Ionicons } from "@expo/vector-icons";
import { iconColorDanger, iconColorPrimary, iconColorSuccess, iconColorWarning, iconDrawerColor } from "../constants/colorsPalette ";

interface Props{
    size: 10 | 15 | 20 | 25 | 30
    color: typeof iconColorPrimary | typeof iconColorWarning | typeof iconColorDanger | typeof iconColorSuccess | typeof iconDrawerColor
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

    static modalidade({ size, color } : Props ){
        return <Ionicons name='flag-outline' color={color} size={size} />
    }

    static periodicidade({ size, color } : Props ){
        return <Ionicons name='time-outline' color={color} size={size} />
    }

    static numeroParcela({ size, color } : Props ){
        return <Ionicons name='return-up-forward-outline' color={color} size={size} />
    }

    static dia({ size, color } : Props ){
        return <Ionicons name='partly-sunny-outline' color={color} size={size} />
    }

    static diaCorrido({ size, color } : Props ){
        return <Ionicons name='receipt-outline' color={color} size={size} />
    }

    static whatsApp({ size, color } : Props ){
        return <Ionicons name='logo-whatsapp' color={color} size={size} />
    }

    static telefonar({ size, color } : Props ){
        return <Ionicons name='call-outline' color={color} size={size} />
    }

    static editar({ size, color } : Props ){
        return <Ionicons name='pencil-sharp' color={color} size={size} />
    }
    
}