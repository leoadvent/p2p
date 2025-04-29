import { Dimensions } from "react-native"
import { ProgressChart } from "react-native-chart-kit"

interface Props {
    labels: string[]
    data: number[]
    hideLegend: boolean
}
const ProgressRing = ( {labels, data, hideLegend} : Props) =>{
    
    const t = {labels, data}

    return(
        <ProgressChart
            data={t}
            width={Dimensions.get("screen").width - 20}
            height={220}
            strokeWidth={8}
            radius={32}
            hideLegend={hideLegend}
            yAxisInterval={1}
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
            style={{
                marginVertical: 8,
                borderRadius: 16,
                padding:1
            }}
        />
    )
}
export default ProgressRing