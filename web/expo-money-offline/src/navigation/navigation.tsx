import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MeusClientes from "../screens/MeuClientes";

const Stack = createNativeStackNavigator();

const NavigationStack = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
                <Stack.Screen 
                    name="Home" 
                    component={MeusClientes} 
                    options={{ headerShown: false }} 
                />
                {/* Add other screens here */}
            </Stack.Navigator>
        </NavigationContainer>
    )
}
export default NavigationStack;