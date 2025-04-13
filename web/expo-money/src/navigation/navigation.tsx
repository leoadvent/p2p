// NavigationStack.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../screens/home';
import PageTest from '../screens/pageTest';
import Login from '../screens/login';
import CreateRealm from '../screens/createRealm';
import { tabNavigatorColor } from '../constants/colorsPalette ';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator()

type RootStackParamList = {
  Login: undefined;
  MyTabs: undefined;
  newRealm: undefined;
};

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

function MyTabs() {
    return (
        <Tab.Navigator screenOptions={{ headerShown: false , tabBarStyle: { display: "flex", backgroundColor: tabNavigatorColor, height: 60, paddingBottom: 10, paddingTop: 10, borderTopWidth: 0, position: "absolute", bottom: 0, left: 0, right: 0}}}>
            <Tab.Screen name="Home" component={Home} options={{ title:"PG HOME" }} />
            <Tab.Screen name="PageTest" component={PageTest} options={{ title: "PAGE TESTE" }} />
        </Tab.Navigator>
    )
}


export default function NavigationStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false, title: "Ts"}}>
        <Stack.Screen name="Login"  component={Login} />
        <Stack.Screen name="MyTabs"  component={MyTabs} />
        <Stack.Screen name="newRealm" component={CreateRealm} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
