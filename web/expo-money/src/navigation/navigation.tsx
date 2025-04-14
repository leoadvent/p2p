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
import { Ionicons } from '@expo/vector-icons';

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
      <Tab.Navigator
          screenOptions={({ route }) => ({
              headerShown: false,
              tabBarStyle: {
                  display: "flex",
                  backgroundColor: tabNavigatorColor,
                  height: 60,
                  paddingBottom: 10,
                  paddingTop: 5,
                  borderTopWidth: 0,
                  position: "absolute",
                  bottom: 5,
                  left: 0,
                  right: 0
              },
              tabBarIcon: ({ focused, color, size }) => {
                  let iconName: keyof typeof Ionicons.glyphMap = 'home-outline';

                  if (route.name === 'Home') {
                      iconName = focused ? 'home' : 'home-outline';
                  } else if (route.name === 'PageTest') {
                      iconName = focused ? 'document-text' : 'document-text-outline';
                  }
                  
                  return <Ionicons name={iconName} size={size} color={color} />;
              },
              tabBarActiveTintColor: 'tomato',
              tabBarInactiveTintColor: 'gray',
          })}
      >
          <Tab.Screen name="Home" component={Home} options={{ title: "PG HOME" }} />
          <Tab.Screen name="PageTest" component={PageTest} options={{ title: "PAGE TESTE" }} />
      </Tab.Navigator>
  );
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
