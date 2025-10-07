import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Linking,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import { StackParamList } from '@/routes/app.routes';
import { Bug, Lightbulb } from 'lucide-react-native';
import { styles } from './styles';

type NavigationProps = NativeStackNavigationProp<StackParamList>;

type FAQItem = {
  id: number;
  question: string;
  answer: string;
  isExpanded: boolean;
};

export function Help() {
  const navigation = useNavigation<NavigationProps>();
  
  const [faqItems, setFaqItems] = useState<FAQItem[]>([
    {
      id: 1,
      question: 'Como criar uma nova tarefa?',
      answer: 'Para criar uma nova tarefa, toque no botão "+" na tela principal, preencha as informações necessárias e toque em "Salvar".',
      isExpanded: false,
    },
    {
      id: 2,
      question: 'Como organizar minhas tarefas por categoria?',
      answer: 'Você pode criar categorias personalizadas na tela de configurações e atribuir cores e ícones para melhor organização.',
      isExpanded: false,
    },
    {
      id: 3,
      question: 'Como configurar lembretes?',
      answer: 'Ao criar uma tarefa, você pode definir uma data e hora para receber notificações de lembrete.',
      isExpanded: false,
    },
    {
      id: 4,
      question: 'Como fazer backup dos meus dados?',
      answer: 'Vá para Configurações > Dados e Backup e ative o backup automático ou exporte manualmente seus dados.',
      isExpanded: false,
    },
    {
      id: 5,
      question: 'Como convidar pessoas para meus grupos?',
      answer: 'Na tela de grupos, toque no grupo desejado e use a opção "Adicionar Membro" para convidar pessoas.',
      isExpanded: false,
    },
  ]);

  const toggleFAQ = (id: number) => {
    setFaqItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, isExpanded: !item.isExpanded } : item
      )
    );
  };

  const handleContactSupport = () => {
    Alert.alert(
      'Contatar Suporte',
      'Escolha uma opção de contato:',
      [
        {
          text: 'Email',
          onPress: () => {
            Linking.openURL('mailto:suporte@taskly.com?subject=Ajuda e Suporte');
          },
        },
        {
          text: 'WhatsApp',
          onPress: () => {
            Linking.openURL('https://wa.me/5511999999999?text=Preciso de ajuda com o app Taskly');
          },
        },
        {
          text: 'Cancelar',
          style: 'cancel',
        },
      ]
    );
  };

  const handleReportBug = () => {
    Alert.alert(
      'Reportar Bug',
      'Descreva o problema que você encontrou:',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Enviar',
          onPress: () => {
            Linking.openURL('mailto:bugs@taskly.com?subject=Reporte de Bug');
          },
        },
      ]
    );
  };

  const handleFeatureRequest = () => {
    Alert.alert(
      'Solicitar Funcionalidade',
      'Descreva a funcionalidade que você gostaria de ver no app:',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Enviar',
          onPress: () => {
            Linking.openURL('mailto:features@taskly.com?subject=Solicitação de Funcionalidade');
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
        <Text style={styles.headerTitle}>Ajuda e Suporte</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollContainer}>
        {/* Seção de Contato Rápido */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contato Rápido</Text>
          
          <TouchableOpacity style={styles.contactItem} onPress={handleContactSupport}>
            <View style={[styles.contactIcon, { backgroundColor: '#007AFF' }]}>
              <Feather name="message-circle" size={20} color="#fff" />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactTitle}>Suporte ao Cliente</Text>
              <Text style={styles.contactSubtitle}>Entre em contato conosco</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactItem} onPress={handleReportBug}>
            <View style={[styles.contactIcon, { backgroundColor: '#ff4444' }]}>
              <Bug size={20} color="#fff" />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactTitle}>Reportar Bug</Text>
              <Text style={styles.contactSubtitle}>Ajude-nos a melhorar o app</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactItem} onPress={handleFeatureRequest}>
            <View style={[styles.contactIcon, { backgroundColor: '#34C759' }]}>
              <Lightbulb size={20} color="#fff" />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactTitle}>Solicitar Funcionalidade</Text>
              <Text style={styles.contactSubtitle}>Sugira melhorias para o app</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#ccc" />
          </TouchableOpacity>
        </View>

        {/* Perguntas Frequentes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Perguntas Frequentes</Text>
          
          {faqItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.faqItem}
              onPress={() => toggleFAQ(item.id)}
            >
              <View style={styles.faqHeader}>
                <Text style={styles.faqQuestion}>{item.question}</Text>
                <Feather
                  name={item.isExpanded ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color="#007AFF"
                />
              </View>
              
              {item.isExpanded && (
                <Text style={styles.faqAnswer}>{item.answer}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Recursos Úteis */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recursos Úteis</Text>
          
          <TouchableOpacity 
            style={styles.resourceItem}
            onPress={() => navigation.navigate('userManual')}
          >
            <View style={[styles.resourceIcon, { backgroundColor: '#5856D6' }]}>
              <Feather name="book-open" size={20} color="#fff" />
            </View>
            <View style={styles.resourceInfo}>
              <Text style={styles.resourceTitle}>Manual do Usuário</Text>
              <Text style={styles.resourceSubtitle}>Guia completo de uso</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.resourceItem}>
            <View style={[styles.resourceIcon, { backgroundColor: '#FF9500' }]}>
              <Feather name="video" size={20} color="#fff" />
            </View>
            <View style={styles.resourceInfo}>
              <Text style={styles.resourceTitle}>Tutoriais em Vídeo</Text>
              <Text style={styles.resourceSubtitle}>Aprenda com vídeos explicativos</Text>
            </View>
            <Feather name="external-link" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.resourceItem}>
            <View style={[styles.resourceIcon, { backgroundColor: '#8E8E93' }]}>
              <Feather name="users" size={20} color="#fff" />
            </View>
            <View style={styles.resourceInfo}>
              <Text style={styles.resourceTitle}>Comunidade</Text>
              <Text style={styles.resourceSubtitle}>Conecte-se com outros usuários</Text>
            </View>
            <Feather name="external-link" size={20} color="#ccc" />
          </TouchableOpacity>
        </View>

        {/* Informações de Contato */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações de Contato</Text>
          
          <View style={styles.contactInfoItem}>
            <Feather name="mail" size={16} color="#666" />
            <Text style={styles.contactInfoText}>suporte@taskly.com</Text>
          </View>
          
          <View style={styles.contactInfoItem}>
            <Feather name="phone" size={16} color="#666" />
            <Text style={styles.contactInfoText}>(11) 99999-9999</Text>
          </View>
          
          <View style={styles.contactInfoItem}>
            <Feather name="clock" size={16} color="#666" />
            <Text style={styles.contactInfoText}>Segunda a Sexta, 8h às 18h</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
