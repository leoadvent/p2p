import { Text, View } from "react-native";
import BaseScreens from "./BaseScreens";
import { backgroundPrimary } from "../constants/colorsPalette ";
import { stylesGlobal } from "../constants/styles";
import Bazier from "../components/charts/linearCharts";
import ProgressRing from "../components/charts/progressChart";

const PageTest = () => {
  return (
    <BaseScreens backgroundColor={backgroundPrimary} title="Teste">
      <View style={{ width: "100%", display:"flex", flexDirection:"column", alignItems:"baseline"}}>
        <Text>Page Test</Text>
      </View>
      <Bazier label={["jan", "fev", "mar", "abr"]} values={[10, 20, 8, 17]} yAxisLabel={"$"} yAxisSuffix="" />
      <ProgressRing labels={["Adimplente", "Inadimplente", "Ativos"]} data={[0.4, 0.6, 0.8]} hideLegend={false} />
    </BaseScreens>
  );
}
export default PageTest;