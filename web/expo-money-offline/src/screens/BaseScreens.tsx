import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Dimensions, KeyboardAvoidingView, Platform, ScrollView, StatusBar, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TextComponent from "../components/text/text";
import { backgroundPrimary, backgroundSecondary, statusBarColorPrimary, textColorPrimary, textColorStatusBar } from "../constants/colorsPalette ";

type Props = {
    children: React.ReactNode;
    childrenParam?: React.ReactNode;
    showChildrenParan?: boolean;
    title: string;
    backgroundColor?: typeof backgroundPrimary | typeof backgroundSecondary
    rolbackStack?: boolean
    isDrawer?: boolean;
  }

const BaseScreens = ( { children, title, backgroundColor, rolbackStack, childrenParam, showChildrenParan, isDrawer} : Props) => {

  const navigation = useNavigation();
  const dimension = Dimensions.get("window")
  
  const goBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView
        edges={['top', 'left', 'right']}
        style={{
            flex: 1,
            justifyContent: "flex-start",
            alignItems: "center",
            height: 50,
            backgroundColor: statusBarColorPrimary,
        }}  
    >

      <StatusBar barStyle="light-content" translucent={true} showHideTransition={"slide"} animated/>

      <View style={
            [ styles(title.length === 0 && !rolbackStack ? false : true, showChildrenParan ? true : false, isDrawer===undefined ? false : isDrawer).title,
              {
                backgroundColor: statusBarColorPrimary, paddingLeft:15
              }
            ]}>
          
          <View style={{ display:"flex", flex: 1, width:"100%", justifyContent:"center", alignItems:"center", flexDirection:"row", paddingLeft: 10}}>
            
            <TextComponent textAlign="center" color={textColorStatusBar} fontSize={14} text={title ? `${title}` : ""}/>
                        
            {rolbackStack && 
              <View style={{  marginRight: 50 }}>
                <TouchableOpacity onPress={rolbackStack ? goBack : () => {}}>
                  <Ionicons name="arrow-back" size={26} color={textColorPrimary} />
                </TouchableOpacity> 
              </View>
            }
          </View>

          { showChildrenParan && childrenParam && (
            <>{childrenParam}</>
          )}

      </View>
      <View style={{ width: "100%", height:24, backgroundColor: backgroundColor ? backgroundColor : backgroundPrimary, marginTop:-20}}/>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
        style={{ flex: 10 }}
      >
          <ScrollView 
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
          >
            <View style={{ display:"flex", height:"100%", width: dimension.width, alignItems:"center",  padding: 0, backgroundColor: backgroundColor ? backgroundColor : backgroundPrimary}}>
              { children }
            </View>
            
          </ScrollView>
        </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
export default BaseScreens;

const styles = (isTitle: boolean, showChildrenParan: boolean, isDrawer: boolean ) => StyleSheet.create({
  title:{
    display: "flex",
    flexDirection: "column",
    width: "100%",
    minHeight: isTitle ? showChildrenParan ? 180 : 50 :  20,
    marginTop: isDrawer ? -40 : 0,
    textAlign: "center",
    alignContent: "center",
    justifyContent: "center",
    padding: 5,
    borderStartEndRadius: 15,
    borderEndEndRadius: 15,
    boxShadow: "0px 4px 10px  rgba(255, 255, 255, 0.2)",
    zIndex: 10,
    elevation: 10,
  }
})