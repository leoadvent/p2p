import { backgroundSecondary, textColorPrimary, textColorStatusBar } from "@/src/constants/colorsPalette ";
import { Ionicons } from "@expo/vector-icons";
import React, { Dispatch, SetStateAction } from "react";
import { Dimensions, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";
import TextComponent from "../text/text";

interface Props {
    title: string;
    children: React.ReactNode;
    buttonClose?: React.ReactNode;
    setVisible: Dispatch<SetStateAction<boolean>>;
    visible: boolean;
    heightProp?: number;
    widthProp?: number;
}

const { width, height } = Dimensions.get("window");

const ModalSystem = ({title, children, buttonClose, setVisible, visible=false, heightProp=height, widthProp=width} : Props) => {

    function handleClose() {
        setVisible(!visible);
    }

  return (
    <React.Fragment>
        <TouchableOpacity onPress={handleClose} >
            { buttonClose }
        </TouchableOpacity>
        <Modal
            isVisible={visible}
            onBackdropPress={handleClose}
            backdropTransitionOutTiming={0}
            style={{ justifyContent: "center", alignItems: "center" }}
            customBackdrop={
                <View style={{flex:1, backgroundColor: "rgb(0, 0, 0)", borderRadius:20}}  />
            }
        >
        <View
            style={{
            display: "flex",
            flexDirection: "column",
            width: widthProp * 0.8,
            height: heightProp * 0.6,
            backgroundColor: "rgb(36, 36, 36)",
            borderRadius: 10,
            padding: 16,
            alignItems: "center",
            overflow: "hidden",
            }}
        >
            <View style={{ 
                display:"flex", 
                flexDirection:"row", 
                width: "100%",  
                backgroundColor: backgroundSecondary, 
                borderRadius: 10 ,
                padding: 8,
                justifyContent: "space-evenly",
                marginBottom: 20,
            }} >
                <View style={{ flex: 7}}>
                    <TextComponent text={title} color={textColorPrimary} fontSize={16} textAlign={"center"} />
                </View>
                <View style={{ flex: 1, alignItems: "flex-end"}}>
                <TouchableOpacity onPress={handleClose}>
                    <Ionicons name="close-circle-outline" size={30} color={textColorStatusBar} />
                </TouchableOpacity>
                </View>
            </View>
                
                {children}

            </View>
        </Modal>
    </React.Fragment>
  );
};

export default ModalSystem;