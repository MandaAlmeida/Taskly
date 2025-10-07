import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import { StackParamList } from '@/routes/app.routes';
import { styles } from './styles';

type NavigationProps = NativeStackNavigationProp<StackParamList>;

export function PrivacyPolicy() {
  const navigation = useNavigation<NavigationProps>();

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
        <Text style={styles.headerTitle}>Política de Privacidade</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Política de Privacidade</Text>
          <Text style={styles.lastUpdated}>Última atualização: 15 de Janeiro de 2024</Text>
          
          <Text style={styles.contentText}>
            Esta Política de Privacidade descreve como o Taskly coleta, usa e protege suas informações pessoais.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações que Coletamos</Text>
          <Text style={styles.contentText}>
            • Informações de conta (nome, email, data de nascimento){'\n'}
            • Conteúdo que você cria (tarefas, anotações, categorias){'\n'}
            • Dados de uso e análise{'\n'}
            • Informações do dispositivo
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Como Usamos suas Informações</Text>
          <Text style={styles.contentText}>
            • Fornecer e melhorar nossos serviços{'\n'}
            • Personalizar sua experiência{'\n'}
            • Enviar notificações importantes{'\n'}
            • Garantir a segurança da plataforma
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Compartilhamento de Dados</Text>
          <Text style={styles.contentText}>
            Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros, exceto quando necessário para fornecer nossos serviços ou quando exigido por lei.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Segurança dos Dados</Text>
          <Text style={styles.contentText}>
            Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações contra acesso não autorizado, alteração, divulgação ou destruição.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Seus Direitos</Text>
          <Text style={styles.contentText}>
            Você tem o direito de:{'\n'}
            • Acessar suas informações pessoais{'\n'}
            • Corrigir dados imprecisos{'\n'}
            • Solicitar a exclusão de dados{'\n'}
            • Revogar consentimento a qualquer momento
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cookies e Tecnologias Similares</Text>
          <Text style={styles.contentText}>
            Utilizamos cookies e tecnologias similares para melhorar sua experiência, analisar o uso do app e fornecer funcionalidades personalizadas.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Alterações nesta Política</Text>
          <Text style={styles.contentText}>
            Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos você sobre mudanças significativas através do app ou por email.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contato</Text>
          <Text style={styles.contentText}>
            Se você tiver dúvidas sobre esta Política de Privacidade, entre em contato conosco:{'\n\n'}
            Email: privacidade@taskly.com{'\n'}
            Telefone: (11) 99999-9999
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
