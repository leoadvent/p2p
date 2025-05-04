import { View } from "react-native";
import TextComponent from "../text/text";
import { backgroundOpacity, textColorPrimary } from "@/src/constants/colorsPalette ";
import Pier, { PierData } from "../charts/piecharts";
import { useEffect, useState } from "react";
import { InvestmentsDTO } from "@/src/types/investmenstDTO";
import api from "@/src/integration/axiosconfig";

const Investimenst = () => {

    const [investmentsDTO, setInvestmentsDTO] = useState<InvestmentsDTO>({} as InvestmentsDTO)
    const [pierData, setPierData] = useState<PierData[]>([])

    useEffect(() => {
        api.get("/financial/investments").then((response) => {
            setPierData([
                {name:"Investido:", data: response.data.investmentsValue, color:"green", legendFontColor:"green", legendFontSize: 8, valueFormated: response.data.formatedInvestmentsValue },
                {name:"A receber:", data: response.data.totalExpectedValue, color:"yellow", legendFontColor:"green", legendFontSize: 8, valueFormated: response.data.formatedTotalExpectedValue },
                {name:"Lucro:", data: response.data.profitValue, color:"blue", legendFontColor:"green", legendFontSize: 8, valueFormated: response.data.formatedProfitValue },
                {name:"Atrasado:", data: response.data.delayedExpectedValue, color:"red", legendFontColor:"green", legendFontSize: 8, valueFormated: response.data.formatedDelayedExpectedValue },
            ])
            setInvestmentsDTO(response.data)
        }).catch((error) => {
            alert("Erro ao buscar os investimentos")
        })
    }, [])
    return (
        <View 
            style={{
                marginTop: 10,
                display: "flex",
                flexDirection: "column",
                flex: 1,
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                backgroundColor: backgroundOpacity,
                borderRadius: 10,
                padding: 10,
            }}
        >
            <TextComponent text={"Investimentos Realizados"} color={textColorPrimary} fontSize={20} textAlign={"auto"} />                
            
            <Pier object={pierData} />
        </View>
    )
}
export default Investimenst;