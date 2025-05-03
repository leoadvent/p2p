import { Dimensions } from "react-native";
import { PieChart } from "react-native-chart-kit"

interface Props {
    object: {name: string, data: number, color: string, legendFontColor: string, legendFontSize: number}[]
}
const Pier = ({ object } : Props) => {
    return(
        <PieChart
            data={object}
            width={Dimensions.get("screen").width - 20}
            height={220}
            yAxisLabel="Label"
            yAxisSuffix="Sufixx"
            chartConfig={{
                backgroundGradientFrom: "#1E2923",
                backgroundGradientFromOpacity: 0,
                backgroundGradientTo: "#08130D",
                backgroundGradientToOpacity: 0.5,
                color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
                strokeWidth: 2, // optional, default 3
                barPercentage: 0.5,
                useShadowColorFromDataset: false ,// optional
                style: {
                    borderRadius: 10,
                  },
                  propsForDots: {
                    r: "6",
                    strokeWidth: "2",
                    stroke: "#ffa726"
                  }
            }}
            accessor={"data"}
            backgroundColor={"transparent"}
            paddingLeft={"15"}
            center={[10, 10]}
            absolute
        />
    )
}
export default Pier