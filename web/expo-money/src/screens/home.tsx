import { KeyboardAvoidingView, ScrollView, View } from "react-native";
import BaseScreens from "./BaseScreens";
import { backgroundPrimary } from "../constants/colorsPalette ";
import DueToday from "../components/dueToday";
import { useState } from "react";

const HomeScreen = () => {

  const [dueTodayActive, setDueTodayActive] = useState<number>(0)

  return (
    <BaseScreens backgroundColor={backgroundPrimary} title="Home" showUserIntrospect={true}>
       <View style={{ height: 600, justifyContent: "center", alignItems: "center", gap: 20 }}>
        <KeyboardAvoidingView>
        <ScrollView style={{ height: 150, padding: 20, gap: 20 }} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false} contentContainerStyle={{ alignItems: "center", padding: 20 }}>
            
              <DueToday idComponent={1} setDueTodayActive={setDueTodayActive} dueTodayActive={dueTodayActive} days={0}/>
              <DueToday idComponent={2} setDueTodayActive={setDueTodayActive} dueTodayActive={dueTodayActive} days={7}/>
    
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </BaseScreens>
  );
}
export default HomeScreen;