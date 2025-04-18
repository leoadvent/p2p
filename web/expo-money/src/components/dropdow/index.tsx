import { ReactElement } from "react"
import { View } from "react-native"

interface Props {
    width: number
    display: "flex" | "none"
    top: number
    children: ReactElement
}
const DropDow = ({ width, display, top, children } : Props) => {
    return (
        <View style={{ 
            display: display,
            position:"absolute", 
            top: top,
            zIndex:10, 
            backgroundColor: "#fff", 
            width:width, 
            height: 200,
            borderWidth: 1,
            borderColor: "#000",
            borderRadius: 10
        }}>
            { children }
        </View>
    )
}
export default DropDow