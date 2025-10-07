import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import { StackParamList } from '@/routes/app.routes';
import { styles } from './styles';

type NavigationProps = NativeStackNavigationProp<StackParamList>;

export function Settings() {
  const navigation = useNavigation<NavigationProps>();
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(true);

  const handleExportData = () => {
    Alert.alert(
      'Exportar Dados',
      'Deseja exportar todos os seus dados?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Exportar',
          onPress: () => {
            Alert.alert('Sucesso', 'Dados exportados com sucesso!');
          },
        },
      ]
    );
  };

  const handleImportData = () => {
    Alert.alert(
      'Importar Dados',
      'Deseja importar dados de um backup?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Importar',
          onPress: () => {
            Alert.alert('Sucesso', 'Dados importados com sucesso!');
          },
        },
      ]
    );
  };

  const handleClearCache = () => {
    Alert.alert(
      'Limpar Cache',
      'Deseja limpar o cache da aplicação?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Limpar',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Sucesso', 'Cache limpo com sucesso!');
          },
        },
      ]
    );
  };

  const handleResetSettings = () => {
    Alert.alert(
      'Redefinir Configurações',
      'Todas as configurações serão redefinidas para os valores padrão. Deseja continuar?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Redefinir',
          style: 'destructive',
          onPress: () => {
            setNotificationsEnabled(true);
            setDarkModeEnabled(false);
            setSoundEnabled(true);
            setVibrationEnabled(true);
            setAutoBackupEnabled(true);
            Alert.alert('Sucesso', 'Configurações redefinidas!');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Configurações</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollContainer}>
        {/* Notificações */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notificações</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIcon, { backgroundColor: '#007AFF' }]}>
                <Feather name="bell" size={20} color="#fff" />
              </View>
              <Text style={styles.settingText}>Notificações Push</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#e9ecef', true: '#007AFF' }}
              thumbColor="#fff"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIcon, { backgroundColor: '#34C759' }]}>
                <Feather name="volume-2" size={20} color="#fff" />
              </View>
              <Text style={styles.settingText}>Som</Text>
            </View>
            <Switch
              value={soundEnabled}
              onValueChange={setSoundEnabled}
              trackColor={{ false: '#e9ecef', true: '#34C759' }}
              thumbColor="#fff"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIcon, { backgroundColor: '#FF9500' }]}>
                <Feather name="smartphone" size={20} color="#fff" />
              </View>
              <Text style={styles.settingText}>Vibração</Text>
            </View>
            <Switch
              value={vibrationEnabled}
              onValueChange={setVibrationEnabled}
              trackColor={{ false: '#e9ecef', true: '#FF9500' }}
              thumbColor="#fff"
            />
          </View>
        </View>

        {/* Aparência */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Aparência</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIcon, { backgroundColor: '#8E8E93' }]}>
                <Feather name="moon" size={20} color="#fff" />
              </View>
              <Text style={styles.settingText}>Modo Escuro</Text>
            </View>
            <Switch
              value={darkModeEnabled}
              onValueChange={setDarkModeEnabled}
              trackColor={{ false: '#e9ecef', true: '#8E8E93' }}
              thumbColor="#fff"
            />
          </View>
        </View>

        {/* Dados e Backup */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dados e Backup</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIcon, { backgroundColor: '#5856D6' }]}>
                <Feather name="cloud" size={20} color="#fff" />
              </View>
              <Text style={styles.settingText}>Backup Automático</Text>
            </View>
            <Switch
              value={autoBackupEnabled}
              onValueChange={setAutoBackupEnabled}
              trackColor={{ false: '#e9ecef', true: '#5856D6' }}
              thumbColor="#fff"
            />
          </View>

          <TouchableOpacity style={styles.settingItem} onPress={handleExportData}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIcon, { backgroundColor: '#34C759' }]}>
                <Feather name="download" size={20} color="#fff" />
              </View>
              <Text style={styles.settingText}>Exportar Dados</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={handleImportData}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIcon, { backgroundColor: '#007AFF' }]}>
                <Feather name="upload" size={20} color="#fff" />
              </View>
              <Text style={styles.settingText}>Importar Dados</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#ccc" />
          </TouchableOpacity>
        </View>

        {/* Manutenção */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Manutenção</Text>
          
          <TouchableOpacity style={styles.settingItem} onPress={handleClearCache}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIcon, { backgroundColor: '#FF9500' }]}>
                <Feather name="trash" size={20} color="#fff" />
              </View>
              <Text style={styles.settingText}>Limpar Cache</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={handleResetSettings}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIcon, { backgroundColor: '#ff4444' }]}>
                <Feather name="refresh-cw" size={20} color="#fff" />
              </View>
              <Text style={styles.settingText}>Redefinir Configurações</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#ccc" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
