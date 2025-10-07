import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import { StackParamList } from '@/routes/app.routes';
import { useTask } from '@/hooks/useTask';
import { styles } from './styles';

type NavigationProps = NativeStackNavigationProp<StackParamList>;

export function EditProfile() {
  const navigation = useNavigation<NavigationProps>();
  const { data, setData } = useTask();
  
  const [name, setName] = useState(data.user?.name || '');
  const [email, setEmail] = useState(data.user?.email || '');
  const [birth, setBirth] = useState(data.user?.birth || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Erro', 'Por favor, insira seu nome');
      return;
    }

    if (!email.trim()) {
      Alert.alert('Erro', 'Por favor, insira seu email');
      return;
    }

    setIsLoading(true);
    
    try {
      // Aqui você implementaria a chamada para a API para atualizar o perfil
      // Por enquanto, vamos apenas atualizar o estado local
      setData(prevData => ({
        ...prevData,
        user: prevData.user ? {
          ...prevData.user,
          name: name.trim(),
          email: email.trim(),
          birth: birth.trim(),
        } : null,
      }));

      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar o perfil. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePhoto = () => {
    Alert.alert(
      'Alterar Foto',
      'Escolha uma opção',
      [
        {
          text: 'Câmera',
          onPress: () => {
            // Implementar abertura da câmera
            Alert.alert('Câmera', 'Funcionalidade de câmera será implementada');
          },
        },
        {
          text: 'Galeria',
          onPress: () => {
            // Implementar abertura da galeria
            Alert.alert('Galeria', 'Funcionalidade de galeria será implementada');
          },
        },
        {
          text: 'Cancelar',
          style: 'cancel',
        },
      ]
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Feather name="arrow-left" size={24} color="#007AFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Editar Perfil</Text>
          <TouchableOpacity 
            style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={isLoading}
          >
            <Text style={styles.saveButtonText}>
              {isLoading ? 'Salvando...' : 'Salvar'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Foto do Perfil */}
        <View style={styles.photoSection}>
          <View style={styles.avatarContainer}>
            {data.user?.imageUser ? (
              <Image source={{ uri: data.user.imageUser }} style={styles.avatar} />
            ) : (
              <View style={styles.defaultAvatar}>
                <Feather name="user" size={40} color="#666" />
              </View>
            )}
            <TouchableOpacity style={styles.changePhotoButton} onPress={handleChangePhoto}>
              <Feather name="camera" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.changePhotoText} onPress={handleChangePhoto}>
            <Text style={styles.changePhotoTextContent}>Alterar foto</Text>
          </TouchableOpacity>
        </View>

        {/* Formulário */}
        <View style={styles.formSection}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Nome</Text>
            <TextInput
              style={styles.textInput}
              value={name}
              onChangeText={setName}
              placeholder="Digite seu nome"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.textInput}
              value={email}
              onChangeText={setEmail}
              placeholder="Digite seu email"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Data de Nascimento</Text>
            <TextInput
              style={styles.textInput}
              value={birth}
              onChangeText={setBirth}
              placeholder="DD/MM/AAAA"
              placeholderTextColor="#999"
            />
          </View>
        </View>

        {/* Botão de Excluir Conta */}
        <View style={styles.deleteSection}>
          <TouchableOpacity style={styles.deleteButton}>
            <Feather name="trash-2" size={20} color="#ff4444" />
            <Text style={styles.deleteButtonText}>Excluir Conta</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
