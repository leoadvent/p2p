import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../integration/axiosconfig";
import { Image } from "react-native";
import { textColorDeactivated, textColorError } from "../constants/colorsPalette ";

interface Props {
    urlPhoto: string
    amountFinancialLoansPending: number
    width?: number
    height?: number
}
const ShowImageCustomer = ( {urlPhoto, amountFinancialLoansPending, width, height} : Props) => {
    
        if (urlPhoto == null || urlPhoto === "") {
            return 
        }

        const realm = AsyncStorage.getItem("realmName");
        console.log("URL FOTO: ", `${BASE_URL}/minio/download/${realm}/${urlPhoto}`)
        return (
            <Image 
                source={{ uri: `${BASE_URL}/minio/download/realm-mauricio-nassau/${urlPhoto}` }} 
                style={{ width: width, height: height, borderRadius:80, borderWidth:2,  borderColor: amountFinancialLoansPending > 0 ? textColorError : textColorDeactivated  }}/>
        )
    
}
export default ShowImageCustomer;