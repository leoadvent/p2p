import { Dimensions, View } from "react-native";
import { PieChart } from "react-native-chart-kit"
import TextComponent from "../../text/text";
import { textColorPrimary } from "@/src/constants/colorsPalette ";

export interface PierData {name: string, data: number, color: string, legendFontColor: string, legendFontSize: number, valueFormated: string}

interface Props {
    object: PierData[]
}
const Pier = ({ object } : Props) => {
    return(
        <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 10, height: 220 }}>
            <PieChart
                data={object}
                width={180}
                height={180}
                chartConfig={{
                    backgroundGradientFrom: "#1E2923",
                    backgroundGradientFromOpacity: 5,
                    backgroundGradientTo: "#08130D",
                    backgroundGradientToOpacity: 0.5,
                    color: (opacity = 5) => `rgba(26, 255, 146, ${opacity})`,
                    strokeWidth: 2, // optional, default 3
                    barPercentage: 0.5,
                    useShadowColorFromDataset: false ,// optional
                    style: {
                        borderRadius: 10,
                    }
                }}
                accessor={"data"}
                backgroundColor={"transparent"}
                paddingLeft={"15"}
                center={[10, 10]}
                absolute
                hasLegend={false}
            />
            <View>
                <View style={{ marginTop: 10 }}>
                    {object.map((item, index) => (
                        <View key={index} style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
                            <View style={{ width: 12, height: 12, backgroundColor: item.color, marginRight: 6, borderRadius: 6 }} />
                            <TextComponent text={`${item.name} ${item.valueFormated}`} color={textColorPrimary} fontSize={10} textAlign={"center"} />
                        </View>
                    ))}
                </View>
            </View>
        </View>
    )
}
export default Pier