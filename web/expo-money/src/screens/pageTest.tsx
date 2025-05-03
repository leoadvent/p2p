import { Text, View } from "react-native";
import BaseScreens from "./BaseScreens";
import { backgroundPrimary } from "../constants/colorsPalette ";
import { stylesGlobal } from "../constants/styles";
import Bazier from "../components/charts/linearCharts";
import ProgressRing from "../components/charts/progressChart";
import Pier from "../components/charts/piecharts";

const PageTest = () => {
  return (
    <BaseScreens backgroundColor={backgroundPrimary} title="Teste">
      <View style={{ width: "100%", display:"flex", flexDirection:"column", alignItems:"baseline"}}>
        <Text>Page Test</Text>
      </View>
      <Bazier label={["jan", "fev", "mar", "abr"]} values={[10, 20, 8, 17]} yAxisLabel={"$"} yAxisSuffix="" />
      <ProgressRing labels={["Adimplente", "Inadimplente", "Ativos"]} data={[0.4, 0.6, 0.8]} hideLegend={false} />
      <Pier object={[{name:"Investido", data: 4321.14, color:"green", legendFontColor:"green", legendFontSize: 15 }, {name:"Investido", data: 4321.14, color:"red", legendFontColor:"green", legendFontSize: 15 }]} />
    </BaseScreens>
  );
}
export default PageTest;