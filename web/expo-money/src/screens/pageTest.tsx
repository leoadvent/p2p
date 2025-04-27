import { Text, View } from "react-native";
import BaseScreens from "./BaseScreens";
import { backgroundPrimary } from "../constants/colorsPalette ";
import { stylesGlobal } from "../constants/styles";

const PageTest = () => {
  return (
    <BaseScreens backgroundColor={backgroundPrimary} title="Teste">
      <View style={ stylesGlobal.viewComponentBaseScree}>
        <Text>Page Test</Text>
      </View>
    </BaseScreens>
  );
}
export default PageTest;