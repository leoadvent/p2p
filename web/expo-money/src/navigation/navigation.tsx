// NavigationStack.tsx
import React from 'react';
import { NavigationContainer, useRoute } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Home from '../screens/home';
import PageTest from '../screens/pageTest';
import Login from '../screens/login';
import CreateRealm from '../screens/createRealm';
import { statusBarColorPrimary, tabNavigatorColor, textColorPrimary } from '../constants/colorsPalette ';
import { Ionicons } from '@expo/vector-icons';
import NewClient from '../screens/newClient';
import MyClient from '../screens/myClient';
import { CustomerDTO } from '../types/customerDTO';
import FinancialLoansCreate from '../screens/financialLoansCreate';
import FinancialLoansPendingByCustumer from '../screens/financialLoansPendingByCustomer';
import FinancialLoansPaidPendingByCustumer from '../screens/FinancialLoansPaidPendingByCustumer';
import CustomerDefaulting from '../screens/customerDefaulting';
import DelinquentCustomerScreen from '../screens/deliquentCustomer';
import CustomerCommitment from '../screens/CustomerCommitment';
import ExecutedPledgeByCustomer from '../screens/ExecutedPledgeByCustomer';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator()
const DrawerClient = createDrawerNavigator()

type RootStackParamList = {
  Login: undefined;
  MyTabs: undefined;
  newRealm: undefined;
  CustomerDefaulting: undefined;
  Clients: undefined;
  DueToday: undefined;
  DeliquentCustomer: undefined;
  NewClient: { clientEdit?: {}  | undefined;};
  CreateFinancial: {customer?: {} | undefined}
  FinanciamentoPendentePorCliente: {customerId: string}
  FinanciamentoPendenteParcelasPorCliente: {financialLoasPaid: {}, loansId: string, commitmentItems: []};
  CustomerCommitment: {customerId: string};
  ExecutedPledgeByCustomer: {nameCustomer: string, idCustomer: string};
};

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

function MyDrawerCient() {

  const route = useRoute();

  const colorIcon = "rgb(255, 72, 0)"
  const sizeIcon = 25

  return (
    <DrawerClient.Navigator
        initialRouteName='MeusClientes'
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
        name="NewClient" 
        component={NewClient} 
        options={{ 
            title: "NOVO CLIENTE" , 
            drawerIcon: () => <Ionicons name='people' size={sizeIcon} color={colorIcon} />}} 
        initialParams={{ clientEdit: {} as CustomerDTO }}
      />
      <DrawerClient.Screen 
            name="MeusClientes" 
            component={MyClient} 
            options={{ 
              headerTransparent: true,
              title: "MEUS CLIENTES" ,
              drawerIcon: () => <Ionicons name='people-circle' size={sizeIcon} color={colorIcon} />
            }} 
        />
      <DrawerClient.Screen 
        name='CreateFinancial'
        component={FinancialLoansCreate}
        initialParams={{ customer: {} as CustomerDTO }}
        options={{ 
          headerTransparent: true,
          title: "FINANCIAR" ,
          drawerIcon: () => <Ionicons name='cash-sharp' size={sizeIcon} color={colorIcon} />
        }} 
      />
      <DrawerClient.Screen 
        name='CustomerDefaulting'
        component={CustomerDefaulting}
        options={{
          headerTransparent: true,
          title: "CLIENTES INADÍMPLENTES" ,
          drawerIcon: () => <Ionicons name='trending-down-outline' size={sizeIcon} color={colorIcon} />
        }}
      />
      <DrawerClient.Screen 
        name='DeliquentCustomer'
        component={DelinquentCustomerScreen}
        options={{
          headerTransparent: true,
          title: "PARCELAS ATRASADAS" ,
          drawerIcon: () => <Ionicons name='calendar-clear-outline' size={sizeIcon} color={colorIcon} />
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
                  paddingBottom: 0,
                  paddingTop: 5,
                  borderTopWidth: 0,
                  position: "relative",
                  bottom: 0,
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
        <Stack.Screen name="CreateFinancial" component={FinancialLoansCreate} />
        <Stack.Screen name="FinanciamentoPendentePorCliente" component={FinancialLoansPendingByCustumer} />
        <Stack.Screen name="FinanciamentoPendenteParcelasPorCliente" component={FinancialLoansPaidPendingByCustumer} />
        <Stack.Screen name="CustomerCommitment" component={CustomerCommitment} />
        <Stack.Screen name="ExecutedPledgeByCustomer" component={ExecutedPledgeByCustomer} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
