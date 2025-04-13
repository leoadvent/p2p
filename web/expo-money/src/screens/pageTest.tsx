import { Text, View } from "react-native";
import BaseScreens from "./BaseScreens";
import { backgroundPrimary } from "../constants/colorsPalette ";

const PageTest = () => {
  return (
    <BaseScreens backgroundColor={backgroundPrimary} title="Teste">
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      > 
        <Text>Page Test</Text>
      </View>
    </BaseScreens>
  );
}
export default PageTest;