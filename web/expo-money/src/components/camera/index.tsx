import { CameraType, CameraView, useCameraPermissions, Camera } from "expo-camera";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ButtonComponent from "../button";
import { Ionicons } from "@expo/vector-icons";

interface Props {
    setUriPhtograph: Dispatch<SetStateAction<string>>
    isCameraActive: boolean;
    setIsCameraActive: Dispatch<SetStateAction<boolean>>;
}
const CameraSystem = ({ setUriPhtograph, isCameraActive = false, setIsCameraActive }: Props) => {

    const camRef = useRef<CameraView | null>(null);

    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();

    if (!permission) {
        return <View />;
    }

    if (!permission.granted) {
        return (
            <View>
                <Text>Precisamos da sua permissão para mostrar a câmera</Text>
                <ButtonComponent nameButton={"grant permission"} onPress={requestPermission} typeButton={"primary"} width={"100%"} />
            </View>
        );
    }

    function toggleCameraFacing() {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    }

    async function takePicture(){
        if(camRef.current !== null){
            const data = await camRef.current.takePictureAsync();
            if (data && data.uri) {
                setUriPhtograph(data.uri)
                setIsCameraActive(false)
            }
        }
    }

    return (
        <View>
            {isCameraActive && (
                <CameraView style={styles.camera} facing={facing} ref={camRef}>                       
                        <TouchableOpacity onPress={toggleCameraFacing}>
                            <Ionicons name="camera-reverse-outline" color={'rgb(255,255,255)'} size={25}/>
                        </TouchableOpacity>
                        <TouchableOpacity  onPress={takePicture}>
                            <Ionicons name="camera-outline" color={'rgb(255,255,255)'} size={25}/>
                        </TouchableOpacity>
                </CameraView>
            )}
        </View>
    )
}

export default CameraSystem;

const styles = StyleSheet.create({
    camera: {
        marginLeft:-140,
        flex: 1,
        borderRadius: 30,
        position: 'absolute',
        display: 'flex',
        zIndex: 10,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        width: 300,
        height: 300,
        padding: 20,
        borderColor: 'rgb(189, 188, 190)',
        borderWidth: 2,
        gap: 20,
    },
});
