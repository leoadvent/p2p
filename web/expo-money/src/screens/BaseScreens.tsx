import { View, StatusBar, StyleSheet, Text, TouchableOpacity } from "react-native";
import TextComponent from "../components/text/text";
import { backgroundPrimary, backgroundSecondary, statusBarColorPrimary, textColorPrimary, textColorStatusBar } from "../constants/colorsPalette ";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

type Props = {
    children: React.ReactNode;
    title: string;
    backgroundColor?: typeof backgroundPrimary | typeof backgroundSecondary
    rolbackStack?: boolean
  }

const BaseScreens = ( { children, title, backgroundColor, rolbackStack} : Props) => {

  const navigation = useNavigation();
  
  const goBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView
        style={{
            flex: 1,
            justifyContent: "flex-start",
            alignItems: "center",
            padding:0,
            backgroundColor: backgroundColor ? backgroundColor : backgroundPrimary,
        }}  
    >
        <StatusBar barStyle="light-content" backgroundColor={statusBarColorPrimary} />
        <View style={
            [ styles(title.length === 0 && !rolbackStack ? false : true).title,
              {
                display:"flex", backgroundColor: statusBarColorPrimary, flexDirection:"row", paddingLeft:15
              }
            ]}>
   
          <TextComponent textAlign="center" color={textColorStatusBar} fontSize={14} text={title ? title : ""}/>

          {rolbackStack && 
            <View style={{ flex: 1, alignItems:"flex-end", paddingRight: 10}}>
              <TouchableOpacity onPress={rolbackStack ? goBack : () => {}}>
                <Ionicons name="arrow-back" size={26} color={textColorStatusBar} />
              </TouchableOpacity> 
            </View>
          }
          
        </View>
        <View style={{ display:"flex", alignItems:"center", flex: 1, padding: 10}}>
          { children}
        </View>
    </SafeAreaView>
  );
}
export default BaseScreens;

const styles = (isTile: boolean ) => StyleSheet.create({
  title:{
    display: "flex",
    width: "100%",
    height: isTile ? 50 : 1,
    marginTop: 0,
    textAlign: "center",
    alignContent: "center",
    justifyContent: "center",
    padding: 5,
    borderStartEndRadius: 15,
    borderEndEndRadius: 15,
    boxShadow: "0px 4px 10px  rgba(255, 255, 255, 0.2)",
  }
})