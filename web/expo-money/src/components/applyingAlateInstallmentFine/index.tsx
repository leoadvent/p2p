import { Dimensions, View } from "react-native"
import ButtonComponent from "../button";
import { useState } from "react";
import api from "@/src/integration/axiosconfig";

const ApplyingAlateInstallmentFine = () => {

    const width = Dimensions.get("screen").width;

    const [showSpinner, setShowSpinner] = useState<boolean>(false)

    function handleApplyingAlateInstallmentFine() {
        setShowSpinner(true)
        api.patch('/financial/applyingAlateInstallmentFine').then(() => {
            alert("Multa aplicada com sucesso!")
        }).catch((error) => {
            alert(error)
        }).finally(() => {  
            setShowSpinner(false)
        }
        )
    }

    return (
        <View style={{ 
                    display: "flex", 
                    width: width-30, 
                    justifyContent: "center", 
                    alignItems: "center", 
                    gap: 20, 
                    padding: 20, 
                    backgroundColor: "transparent",
                    borderRadius: 10
                }}>
                    <ButtonComponent 
                        nameButton={"CALCULAR MULTA"} 
                        onPress={() => handleApplyingAlateInstallmentFine()} 
                        typeButton={"warning"} 
                        width={"100%"} 
                        isSpinner={showSpinner}
                    />
                </View>
    )
}
export default ApplyingAlateInstallmentFine