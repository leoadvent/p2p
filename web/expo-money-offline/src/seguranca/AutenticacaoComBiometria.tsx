import * as LocalAuthentication from 'expo-local-authentication';
import { Alert } from 'react-native';

async function autenticarComBiometria() : Promise<boolean> {
  // Verifica se há suporte a biometria
  const isHardwareAvailable = await LocalAuthentication.hasHardwareAsync();
  if (!isHardwareAvailable) {
    Alert.alert('Erro', 'Dispositivo não possui suporte biométrico.');
    return false;
  }

  // Verifica se algum método biométrico está cadastrado
  const isEnrolled = await LocalAuthentication.isEnrolledAsync();
  if (!isEnrolled) {
    Alert.alert('Erro', 'Nenhuma biometria cadastrada no dispositivo.');
    return false;
  }

  // Solicita autenticação
  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: 'Autentique-se com sua digital',
    fallbackLabel: 'Usar senha',
    cancelLabel: 'Cancelar'
  });

  if (result.success) {
    Alert.alert('Sucesso', 'Autenticado com sucesso!');
    return true
  } else {
    Alert.alert('Falha', 'Autenticação falhou ou foi cancelada.');
    return false
  }
}

export default autenticarComBiometria