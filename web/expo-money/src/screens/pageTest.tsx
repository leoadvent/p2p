import { Text, View, StyleSheet, TouchableOpacity, Image } from "react-native";
import BaseScreens from "./BaseScreens";
import { backgroundPrimary } from "../constants/colorsPalette ";
import Bazier from "../components/charts/linearCharts";
import ProgressRing from "../components/charts/progressChart";
import Pier from "../components/charts/piecharts";
import CameraSystem from "../components/camera";
import { useState } from "react";
import ButtonComponent from "../components/button";


const PageTest = () => {

  const [isCameraActive, setIsCameraActive] = useState(false);
  const [uriPhtograph, setUriPhtograph] = useState<string>("");
  
  return (
    <BaseScreens backgroundColor={backgroundPrimary} title="Teste">

      {uriPhtograph !== "" && <Image source={{ uri: uriPhtograph }} style={{ width: 200, height: 200 }} />}

      <ButtonComponent nameButton={"Ligar Câmera"} onPress={() => setIsCameraActive(!isCameraActive)} typeButton={"primary"} width={"100%"} />

      <CameraSystem setUriPhtograph={setUriPhtograph} isCameraActive={isCameraActive} setIsCameraActive={setIsCameraActive}/>
      
      <View style={{ width: "100%", display:"flex", flexDirection:"column", alignItems:"baseline"}}>
        <Text>Page Test</Text>
      </View>
      <Bazier label={["jan", "fev", "mar", "abr"]} values={[10, 20, 8, 17]} yAxisLabel={"$"} yAxisSuffix="" />
      <ProgressRing labels={["Adimplente", "Inadimplente", "Ativos"]} data={[0.4, 0.6, 0.8]} hideLegend={false} />
      <Pier object={[{name:"Investido", data: 4321.14, color:"green", legendFontColor:"green", legendFontSize: 15, valueFormated:"R$4321,14" }, {name:"Investido", data: 4321.14, color:"red", legendFontColor:"green", legendFontSize: 15, valueFormated:"R$4321,14" }]} />
    </BaseScreens>
  );
}
export default PageTest;