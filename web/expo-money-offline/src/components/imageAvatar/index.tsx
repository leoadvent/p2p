
import { Image, View } from "react-native";
import { textColorDeactivated, textColorError, textColorSecondary } from "../../constants/colorsPalette ";
import TextComponent from "../text/text";

interface Props {
    urlPhoto: string
    amountFinancialLoansPending: number
    firsName: string
    lastName: string
    width?: number
    height?: number
}
const ShowImageCliente = ( {urlPhoto, amountFinancialLoansPending, firsName, lastName, width, height} : Props) => {
    
        if (urlPhoto == null || urlPhoto === "") {
            return (
                 <View style={{ width: width, height: height, borderRadius:50, borderWidth:2, backgroundColor:  amountFinancialLoansPending > 0 ? textColorError : textColorSecondary, borderColor:'rgb(18, 93, 179)', alignContent:"center", alignItems:"center", justifyContent:"center" }}>
                    <TextComponent text={`${firsName.charAt(0)}${lastName.charAt(0)}`} color={"rgb(255, 255, 255)"} fontSize={28} textAlign={"center"} fontWeight="800" />
                 </View>
            )
        }

        return (
            <Image 
                source={{ uri: `${urlPhoto}` }} 
                style={{ width: width, height: height, borderRadius:80, borderWidth:2,  borderColor: amountFinancialLoansPending > 0 ? textColorError : textColorDeactivated  }}/>
        )
    
}
export default ShowImageCliente;