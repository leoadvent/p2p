import { View } from "react-native";
import TextComponent from "../components/text/text";
import BaseScreens from "./BaseScreens";

const Home = () => {

    return (
        <BaseScreens title={"HOME"}>
            <View>
                <TextComponent text={"HOME"} color={"rgb(247, 238, 238)"} fontSize={7} textAlign={"center"} />
            </View>
        </BaseScreens>
    )
}

export default Home;