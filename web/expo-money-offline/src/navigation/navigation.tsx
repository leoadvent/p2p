import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { iconDrawerColor, statusBarColorPrimary, tabNavigatorColor, textColorPrimary } from '../constants/colorsPalette ';
import AlertaVencido from '../screens/AlertaVencido';
import AlertaVencimento from '../screens/AlertaVencimento';
import BoasVindas from '../screens/BoasVindas';
import ClienteCrierEditar from '../screens/ClienteCrierEditar';
import Clientes from "../screens/Clientes";
import Configuracoes from '../screens/configuracoes';
import Financiamento from '../screens/Financiamento';
import FinanciamentoNegociar from '../screens/FinanciamentoNegociar';
import FinanciamentoPagamento from '../screens/financiamentoPagamento';
import FinanciamentoReceber from '../screens/FinanciamentoReceber';
import FinanciamentoVisualizacao from '../screens/FinanciamentoVisualizacao';
import Home from '../screens/Home';
import Investimentos from '../screens/Investimentos';
import { CUSTOMER } from '../types/customer';
import { TIPOFINANCIAMENTO } from '../types/tiposFinanciamento';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator()
const DrawerClient = createDrawerNavigator()

type RootStackParamList = {
  tabNavigator: {};
  MeuClientes: {};
  CriarEditarClientes: { clientEdit?: CUSTOMER  | undefined;};
  Financiamento: { clientFinanciamento?: CUSTOMER | undefined};
  FinanciamentoVisualizacao: {cliente: CUSTOMER, financiamentoTipo: TIPOFINANCIAMENTO}
  FinanciamentoPagamento: {cliente: CUSTOMER, idFinanciamento: string}
  FinanciamentoReceber: {idFinanciamento: string, idParcela: string, cliente: CUSTOMER}
  FinanciamentoNegociar: {idFinanciamento: string, idParcela: string, cliente: CUSTOMER}
  Configuracoes: {}
}

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

function MyDrawerNavigatorCliente() {

  const colorIcon = iconDrawerColor
  const sizeIcon = 25
  
  return (
    <DrawerClient.Navigator
        initialRouteName='Meus Clientes'
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
                fontSize: 15,
            }
        }}
    >
         <DrawerClient.Screen 
            name="CriarEditarClientes" 
            component={ClienteCrierEditar} 
            initialParams={{ clientEdit: {} as CUSTOMER }}
            options={{
                title: "Criar / Editar Clientes",
                drawerIcon: ({ color }) => (
                    <Ionicons name="person-add-sharp" size={sizeIcon} color={colorIcon} />
                ),
                headerShown: true
            }} 
        />
        <DrawerClient.Screen 
            name="Meus Clientes" 
            component={Clientes} 
            options={{
                drawerIcon: ({ color }) => (
                    <Ionicons name="people" size={sizeIcon} color={colorIcon} />
                ),
                headerShown: true,
            }} 
        />
        <DrawerClient.Screen 
            name="Vencendo" 
            component={AlertaVencimento} 
            options={{
                drawerIcon: ({ color }) => (
                    <Ionicons name="calendar-number-sharp" size={sizeIcon} color={colorIcon} />
                ),
                headerShown: true,
            }} 
        />
        <DrawerClient.Screen 
            name="Vencidos" 
            component={AlertaVencido} 
            options={{
                drawerIcon: ({ color }) => (
                    <Ionicons name="calendar-clear-sharp" size={sizeIcon} color={colorIcon} />
                ),
                headerShown: true,
            }} 
        />
        {/* Add other screens here */}
    </DrawerClient.Navigator>
  )
}

const MyTabNavigator = () => {

    const inset = useSafeAreaInsets();

    return(
        <Tab.Navigator
          screenOptions={({ route }) => ({
              headerShown: false,
              tabBarStyle: {
                  display: "flex",
                  backgroundColor: tabNavigatorColor,
                  height: 65 + inset.bottom ,
                  paddingTop: 10,
                  paddingBottom: 0,
                  marginBottom: 0,                 
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
                  }	else if (route.name === 'Investimentos'){
                      iconName = focused ? 'receipt' : 'receipt-outline';
                  }
                  
                  return <Ionicons name={iconName} size={size} color={color} />;
              },
              tabBarActiveTintColor: 'tomato',
              tabBarInactiveTintColor: 'gray',
          })}
    >
        <Tab.Screen name="Home" component={Home} options={{ title: "PG HOME" }} />
        <Tab.Screen name="Clients" component={MyDrawerNavigatorCliente} options={{ title: "CLIENTES" }} />
        <Tab.Screen name="Investimentos" component={Investimentos} options={{ title: "INVESTIMENTOS" }} />
    </Tab.Navigator>
    )
}

const NavigationStack = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="BoasVindas" screenOptions={{ headerShown: false }}>
                <Stack.Screen name="BoasVindas" component={BoasVindas} options={{ headerShown: false}} />
                <Stack.Screen name="tabNavigator" component={MyTabNavigator} options={{ headerShown: false }} />
                <Stack.Screen name="Home" component={Clientes} options={{ headerShown: false }} />
                <Stack.Screen name="MeuClientes" component={MyDrawerNavigatorCliente} options={{ headerShown: false }} />
                <Stack.Screen name="Financiamento" component={Financiamento} options={{ headerShown: false }} />
                <Stack.Screen name="FinanciamentoVisualizacao" component={FinanciamentoVisualizacao} options={{ headerShown: false }}/>
                <Stack.Screen name="FinanciamentoPagamento" component={FinanciamentoPagamento} options={{ headerShown: false }}/>
                <Stack.Screen name="FinanciamentoReceber" component={FinanciamentoReceber} options={{ headerShown: false }}/>
                <Stack.Screen name="FinanciamentoNegociar" component={FinanciamentoNegociar} options={{ headerShown: false }}/>
                <Stack.Screen name="Investimentos" component={Investimentos} options={{ headerShown: false }}/>
                <Stack.Screen name="Configuracoes" component={Configuracoes} options={{ headerShown: false }}/>
            </Stack.Navigator>
        </NavigationContainer>
    )
}
export default NavigationStack;