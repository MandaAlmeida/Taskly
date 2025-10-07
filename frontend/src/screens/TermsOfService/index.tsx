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

export function TermsOfService() {
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
        <Text style={styles.headerTitle}>Termos de Uso</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Termos de Uso</Text>
          <Text style={styles.lastUpdated}>Última atualização: 15 de Janeiro de 2024</Text>
          
          <Text style={styles.contentText}>
            Ao usar o aplicativo Taskly, você concorda com estes Termos de Uso. Leia-os cuidadosamente antes de usar nossos serviços.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Aceitação dos Termos</Text>
          <Text style={styles.contentText}>
            Ao criar uma conta ou usar o Taskly, você confirma que leu, entendeu e concorda com estes Termos de Uso e nossa Política de Privacidade.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Descrição dos Serviços</Text>
          <Text style={styles.contentText}>
            O Taskly é um aplicativo de produtividade que permite:{'\n'}
            • Criar e gerenciar tarefas{'\n'}
            • Organizar informações em categorias{'\n'}
            • Colaborar com equipes{'\n'}
            • Receber lembretes e notificações
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Conta do Usuário</Text>
          <Text style={styles.contentText}>
            • Você é responsável por manter a confidencialidade de sua conta{'\n'}
            • Você deve fornecer informações precisas e atualizadas{'\n'}
            • Você é responsável por todas as atividades em sua conta{'\n'}
            • Você deve notificar-nos imediatamente sobre uso não autorizado
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Uso Aceitável</Text>
          <Text style={styles.contentText}>
            Você concorda em não:{'\n'}
            • Usar o serviço para atividades ilegais{'\n'}
            • Violar direitos de propriedade intelectual{'\n'}
            • Interferir no funcionamento do serviço{'\n'}
            • Tentar acessar contas de outros usuários
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Conteúdo do Usuário</Text>
          <Text style={styles.contentText}>
            • Você mantém a propriedade de seu conteúdo{'\n'}
            • Você concede ao Taskly licença para usar seu conteúdo para fornecer o serviço{'\n'}
            • Você é responsável pelo conteúdo que cria e compartilha{'\n'}
            • Não toleramos conteúdo ofensivo ou inadequado
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacidade e Segurança</Text>
          <Text style={styles.contentText}>
            • Sua privacidade é importante para nós{'\n'}
            • Coletamos e usamos dados conforme nossa Política de Privacidade{'\n'}
            • Implementamos medidas de segurança para proteger suas informações{'\n'}
            • Você é responsável por manter seu dispositivo seguro
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Modificações do Serviço</Text>
          <Text style={styles.contentText}>
            • Podemos modificar ou descontinuar funcionalidades{'\n'}
            • Notificaremos sobre mudanças significativas{'\n'}
            • Seu uso continuado após mudanças constitui aceitação{'\n'}
            • Podemos atualizar estes termos periodicamente
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Limitação de Responsabilidade</Text>
          <Text style={styles.contentText}>
            • O Taskly é fornecido "como está"{'\n'}
            • Não garantimos disponibilidade ininterrupta{'\n'}
            • Nossa responsabilidade é limitada conforme a lei aplicável{'\n'}
            • Você usa o serviço por sua conta e risco
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rescisão</Text>
          <Text style={styles.contentText}>
            • Você pode encerrar sua conta a qualquer momento{'\n'}
            • Podemos suspender ou encerrar contas que violam estes termos{'\n'}
            • Após a rescisão, você pode perder acesso aos dados{'\n'}
            • Certas disposições sobrevivem à rescisão
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lei Aplicável</Text>
          <Text style={styles.contentText}>
            Estes termos são regidos pelas leis do Brasil. Qualquer disputa será resolvida nos tribunais brasileiros.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contato</Text>
          <Text style={styles.contentText}>
            Se você tiver dúvidas sobre estes Termos de Uso, entre em contato conosco:{'\n\n'}
            Email: termos@taskly.com{'\n'}
            Telefone: (11) 99999-9999
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
