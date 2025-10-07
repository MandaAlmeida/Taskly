import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Linking,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import { StackParamList } from '@/routes/app.routes';
import { styles } from './styles';

type NavigationProps = NativeStackNavigationProp<StackParamList>;

export function About() {
  const navigation = useNavigation<NavigationProps>();

  const handleWebsite = () => {
    Linking.openURL('https://taskly.com');
  };

  const handleSocialMedia = (platform: string) => {
    const urls = {
      instagram: 'https://instagram.com/taskly',
      twitter: 'https://twitter.com/taskly',
      linkedin: 'https://linkedin.com/company/taskly',
    };
    Linking.openURL(urls[platform as keyof typeof urls]);
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
        <Text style={styles.headerTitle}>Sobre o App</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollContainer}>
        {/* Logo e Nome do App */}
        <View style={styles.appInfoSection}>
          <View style={styles.appLogo}>
            <Feather name="check-circle" size={80} color="#007AFF" />
          </View>
          <Text style={styles.appName}>Taskly</Text>
          <Text style={styles.appVersion}>Versão 1.0.0</Text>
          <Text style={styles.appDescription}>
            Organize suas tarefas, anotações e projetos de forma simples e eficiente.
          </Text>
        </View>

        {/* Descrição */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sobre o Taskly</Text>
          <Text style={styles.descriptionText}>
            O Taskly é um aplicativo de produtividade desenvolvido para ajudar você a 
            organizar sua vida pessoal e profissional. Com recursos intuitivos de 
            gerenciamento de tarefas, categorização inteligente e colaboração em equipe, 
            o Taskly torna a organização mais simples e eficaz.
          </Text>
        </View>

        {/* Recursos Principais */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recursos Principais</Text>
          
          <View style={styles.featureItem}>
            <Feather name="check" size={20} color="#34C759" />
            <Text style={styles.featureText}>Gerenciamento de tarefas intuitivo</Text>
          </View>
          
          <View style={styles.featureItem}>
            <Feather name="check" size={20} color="#34C759" />
            <Text style={styles.featureText}>Categorização personalizada</Text>
          </View>
          
          <View style={styles.featureItem}>
            <Feather name="check" size={20} color="#34C759" />
            <Text style={styles.featureText}>Colaboração em equipe</Text>
          </View>
          
          <View style={styles.featureItem}>
            <Feather name="check" size={20} color="#34C759" />
            <Text style={styles.featureText}>Lembretes e notificações</Text>
          </View>
          
          <View style={styles.featureItem}>
            <Feather name="check" size={20} color="#34C759" />
            <Text style={styles.featureText}>Sincronização em nuvem</Text>
          </View>
        </View>

        {/* Desenvolvedores */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Desenvolvimento</Text>
          
          <View style={styles.developerItem}>
            <Text style={styles.developerTitle}>Desenvolvido por:</Text>
            <Text style={styles.developerName}>Equipe Taskly</Text>
          </View>
          
          <View style={styles.developerItem}>
            <Text style={styles.developerTitle}>Design:</Text>
            <Text style={styles.developerName}>Design Team</Text>
          </View>
          
          <View style={styles.developerItem}>
            <Text style={styles.developerTitle}>Tecnologias:</Text>
            <Text style={styles.developerName}>React Native, TypeScript, Node.js</Text>
          </View>
        </View>

        {/* Links */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Conecte-se Conosco</Text>
          
          <TouchableOpacity style={styles.linkItem} onPress={handleWebsite}>
            <Feather name="globe" size={20} color="#007AFF" />
            <Text style={styles.linkText}>Website Oficial</Text>
            <Feather name="external-link" size={16} color="#ccc" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.linkItem} 
            onPress={() => handleSocialMedia('instagram')}
          >
            <Feather name="instagram" size={20} color="#E4405F" />
            <Text style={styles.linkText}>Instagram</Text>
            <Feather name="external-link" size={16} color="#ccc" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.linkItem} 
            onPress={() => handleSocialMedia('twitter')}
          >
            <Feather name="twitter" size={20} color="#1DA1F2" />
            <Text style={styles.linkText}>Twitter</Text>
            <Feather name="external-link" size={16} color="#ccc" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.linkItem} 
            onPress={() => handleSocialMedia('linkedin')}
          >
            <Feather name="linkedin" size={20} color="#0077B5" />
            <Text style={styles.linkText}>LinkedIn</Text>
            <Feather name="external-link" size={16} color="#ccc" />
          </TouchableOpacity>
        </View>

        {/* Agradecimentos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Agradecimentos</Text>
          <Text style={styles.thanksText}>
            Agradecemos a todos os usuários que contribuíram com feedback e sugestões 
            para tornar o Taskly uma ferramenta cada vez melhor. Seu apoio é fundamental 
            para o nosso crescimento e melhoria contínua.
          </Text>
        </View>

        {/* Copyright */}
        <View style={styles.copyrightSection}>
          <Text style={styles.copyrightText}>
            © 2024 Taskly. Todos os direitos reservados.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
