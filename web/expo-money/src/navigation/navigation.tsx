// NavigationStack.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Home from '../screens/home';
import PageTest from '../screens/pageTest';
import Login from '../screens/login';
import CreateRealm from '../screens/createRealm';
import { statusBarColorPrimary, tabNavigatorColor, textColorPrimary } from '../constants/colorsPalette ';
import { Ionicons } from '@expo/vector-icons';
import NovoCliente from '../screens/novoCliente';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator()
const DrawerClient = createDrawerNavigator()

type RootStackParamList = {
  Login: undefined;
  MyTabs: undefined;
  newRealm: undefined;
};

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

function MyDrawerCient() {
  return (
    <DrawerClient.Navigator
        initialRouteName='Home'
        screenOptions={{
            drawerPosition:"left",
            headerShown: true,
            drawerStyle:{ backgroundColor: statusBarColorPrimary, },
            headerStyle: { backgroundColor: statusBarColorPrimary, },
            headerTintColor: textColorPrimary,
            headerTitleStyle: { fontSize: 14, fontWeight: "bold", color: textColorPrimary },
            drawerActiveBackgroundColor: "rgb(0, 122, 255)",
            drawerInactiveBackgroundColor: "rgba(218, 218, 218, 0.05)",
            drawerLabelStyle: {
                color: "#ffffff",
                fontWeight: 500,
                lineHeight: 18,
                fontSize: 10,
            }
        }}
      >
      <DrawerClient.Screen 
        name="Home" 
        component={NovoCliente} 
        options={{ 
            title: "NOVO CLIENTE" , 
            drawerIcon: () => <Ionicons name='people' size={25} color="rgb(255, 72, 0)" />}} />
      <DrawerClient.Screen 
            name="PageTest" 
            component={PageTest} 
            options={{ 
              headerTransparent: true,
              title: "PAGE TESTE" ,
              drawerIcon: () => <Ionicons name='clipboard' size={20} color="red" />
            }} 
        />
    </DrawerClient.Navigator>
  );

}

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
                  } else if (route.name === 'Clients') {
                      iconName = focused ? 'people' : 'people-outline';
                  }	
                  
                  return <Ionicons name={iconName} size={size} color={color} />;
              },
              tabBarActiveTintColor: 'tomato',
              tabBarInactiveTintColor: 'gray',
          })}
      >
          <Tab.Screen name="Home" component={Home} options={{ title: "PG HOME" }} />
          <Tab.Screen name="Clients" component={MyDrawerCient} options={{ title: "CLIENTES" }} />
          <Tab.Screen name="PageTest" component={PageTest} options={{ title: "PAGE TESTE" }} />
      </Tab.Navigator>
  );
}



export default function NavigationStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false, title: "Ts"}}>
        <Stack.Screen name="Login"  component={Login} />
        <Stack.Screen name="Clients" component={MyDrawerCient} />
        <Stack.Screen name="MyTabs"  component={MyTabs} />
        <Stack.Screen name="newRealm" component={CreateRealm} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
