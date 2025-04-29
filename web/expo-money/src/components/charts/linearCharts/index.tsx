import { chartBazierbackgroundColor, chartBazierbackgroundGradientFrom, chartBazierbackgroundGradientTo, textColorPrimary } from "@/src/constants/colorsPalette ";
import { Dimensions, Text, View } from "react-native";
import { LineChart } from "react-native-chart-kit";

  interface Props{
    label: string[]
    values: number[]
    yAxisLabel: string
    yAxisSuffix: string
  }

  const Bazier = (props: Props) => {

    if(props.label.length <=0 || props.values.length <= 0){
      
      return (
          <View style={{ 
            backgroundColor: chartBazierbackgroundGradientTo, 
            flexDirection: "row", 
            gap:10, 
            flexWrap:"wrap",
            padding: 10,
            justifyContent:"center"
        }}>
            <Text style={{ color: textColorPrimary }}>Sem dados a serem exibidos</Text>
          </View>)
    }

    return(
      <View>
        <LineChart
          data={{
            labels: props.label,
            datasets: [
              {
                data: props.values
              }
            ]
          }}
          width={Dimensions.get("screen").width - 20} // from react-native
          height={220}
          yAxisLabel={props.yAxisLabel}
          yAxisSuffix={props.yAxisSuffix}
          yAxisInterval={1} // optional, defaults to 1
          chartConfig={{
            backgroundColor: chartBazierbackgroundColor,
            backgroundGradientFrom: chartBazierbackgroundGradientFrom,
            backgroundGradientTo: chartBazierbackgroundGradientTo,
            decimalPlaces: 2, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 10,
            },
            propsForDots: {
              r: "6",
              strokeWidth: "2",
              stroke: "#ffa726"
            }
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16,
            padding:1
          }}
        />
      </View>
    )
  }
  export default Bazier