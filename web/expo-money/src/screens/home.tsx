import { View, Text } from "react-native";
import BaseScreens from "./BaseScreens";
import { backgroundPrimary } from "../constants/colorsPalette ";
import DueToday from "../components/dueToday";

const HomeScreen = () => {
  return (
    <BaseScreens backgroundColor={backgroundPrimary} title="Home" showUserIntrospect={true}>
      <View
          style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
          }}
      >
        <DueToday />
        <Text>Home Screen</Text>
        <Text>Welcome to the home screen!</Text>
      </View>
    </BaseScreens>
  );
}
export default HomeScreen;