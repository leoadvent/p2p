import { backgroundOpacity, textColorPrimary } from "@/src/constants/colorsPalette ";
import { View } from "react-native";
import Bazier from "../charts/linearCharts";
import TextComponent from "../text/text";
import { useEffect, useState } from "react";
import api from "@/src/integration/axiosconfig";

const FundingReceived = () => {

    const [labels, setLabels] = useState<string[]>([])
    const [values, setValues] = useState<number[]>([])
    const [quantDays, setQuantDays] = useState<number>(30)

    useEffect(() => {
        api.get(`/financial/fundingReceivedByPeriod/${quantDays}`).then((response) => {
            response.data.map((item: any) => {
                setLabels((prev) => [...prev, item.duePayment])
                setValues((prev) => [...prev, item.value])
            })
        }).catch((error) => {
            alert("Erro ao buscar os recebimentos")
        })
    },[quantDays])

    return(
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
            <TextComponent text={`Recebimentos dos últimos ${quantDays} dias`} color={textColorPrimary} fontSize={20} textAlign={"auto"} />

            <Bazier label={labels} values={values} yAxisLabel={"$"} yAxisSuffix="" />      
        </View>
    )
}
export default FundingReceived;