import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import { StackParamList } from '@/routes/app.routes';
import { styles } from './styles';

type NavigationProps = NativeStackNavigationProp<StackParamList>;

type ManualSection = {
  id: string;
  title: string;
  icon: string;
  isExpanded: boolean;
  content: string[];
};

export function UserManual() {
  const navigation = useNavigation<NavigationProps>();
  
  const [manualSections, setManualSections] = useState<ManualSection[]>([
    {
      id: 'getting-started',
      title: 'Primeiros Passos',
      icon: 'play-circle',
      isExpanded: false,
      content: [
        'Bem-vindo ao Taskly! Este guia irá ajudá-lo a aproveitar ao máximo todas as funcionalidades do aplicativo.',
        'Para começar, explore as abas principais na parte inferior da tela: Início, Tarefas, Calendário e Anotações.',
        'Use o botão flutuante "+" no centro para criar novas tarefas ou anotações rapidamente.',
        'Configure seu perfil tocando no ícone de perfil no canto superior direito.'
      ]
    },
    {
      id: 'tasks',
      title: 'Gerenciando Tarefas',
      icon: 'check-square',
      isExpanded: false,
      content: [
        'Criar Tarefa: Toque no botão "+" e selecione "Nova Tarefa". Preencha o título, descrição, data de vencimento e prioridade.',
        'Editar Tarefa: Toque em uma tarefa existente para editá-la ou marcá-la como concluída.',
        'Categorias: Organize suas tarefas criando categorias personalizadas com cores e ícones.',
        'Filtros: Use os filtros para visualizar tarefas por status, categoria ou data.',
        'Lembretes: Configure notificações para não esquecer de tarefas importantes.',
        'Subtarefas: Quebre tarefas complexas em subtarefas menores para melhor organização.'
      ]
    },
    {
      id: 'annotations',
      title: 'Anotações e Notas',
      icon: 'edit-3',
      isExpanded: false,
      content: [
        'Criar Anotação: Toque no botão "+" e selecione "Nova Anotação". Escreva suas ideias, lembretes ou informações importantes.',
        'Formatação: Use negrito, itálico e listas para organizar melhor suas anotações.',
        'Anexos: Adicione imagens ou documentos às suas anotações para referência.',
        'Tags: Use tags para categorizar e encontrar anotações rapidamente.',
        'Busca: Use a barra de pesquisa para encontrar anotações específicas.',
        'Sincronização: Suas anotações são sincronizadas automaticamente entre dispositivos.'
      ]
    },
    {
      id: 'calendar',
      title: 'Calendário e Agendamento',
      icon: 'calendar',
      isExpanded: false,
      content: [
        'Visualização: O calendário mostra suas tarefas e eventos organizados por data.',
        'Vista Mensal: Veja todo o mês de uma vez para planejamento de longo prazo.',
        'Vista Semanal: Foque em uma semana específica para planejamento detalhado.',
        'Vista Diária: Organize seu dia hora por hora.',
        'Eventos: Crie eventos recorrentes para atividades regulares.',
        'Integração: O calendário se integra automaticamente com suas tarefas e anotações.'
      ]
    },
    {
      id: 'categories',
      title: 'Categorias e Organização',
      icon: 'folder',
      isExpanded: false,
      content: [
        'Criar Categoria: Vá em Configurações > Categorias para criar novas categorias.',
        'Personalização: Escolha cores e ícones únicos para cada categoria.',
        'Subcategorias: Organize ainda mais criando subcategorias dentro das principais.',
        'Filtros: Use categorias para filtrar tarefas e anotações.',
        'Relatórios: Visualize estatísticas por categoria para entender melhor sua produtividade.',
        'Compartilhamento: Compartilhe categorias com membros do grupo.'
      ]
    },
    {
      id: 'groups',
      title: 'Trabalho em Grupo',
      icon: 'users',
      isExpanded: false,
      content: [
        'Criar Grupo: Vá em Configurações > Grupos para criar um novo grupo de trabalho.',
        'Convidar Membros: Use o link de convite ou adicione membros por email.',
        'Permissões: Defina diferentes níveis de acesso para membros do grupo.',
        'Tarefas Compartilhadas: Crie tarefas que podem ser vistas e editadas por todos os membros.',
        'Comunicação: Use o chat interno para discutir tarefas e projetos.',
        'Relatórios de Grupo: Acompanhe o progresso de toda a equipe.'
      ]
    },
    {
      id: 'notifications',
      title: 'Notificações e Lembretes',
      icon: 'bell',
      isExpanded: false,
      content: [
        'Configurações: Personalize suas notificações em Configurações > Notificações.',
        'Lembretes de Tarefas: Configure lembretes para tarefas com prazo de vencimento.',
        'Notificações Push: Receba alertas mesmo quando o app estiver fechado.',
        'Email: Configure notificações por email para lembretes importantes.',
        'Silenciar: Silencie notificações durante horários específicos.',
        'Personalização: Escolha sons e vibrações diferentes para cada tipo de notificação.'
      ]
    },
    {
      id: 'settings',
      title: 'Configurações e Preferências',
      icon: 'settings',
      isExpanded: false,
      content: [
        'Perfil: Edite suas informações pessoais, foto e preferências.',
        'Aparência: Escolha entre tema claro e escuro, e personalize as cores.',
        'Idioma: Altere o idioma do aplicativo conforme sua preferência.',
        'Backup: Configure backup automático e sincronização com a nuvem.',
        'Privacidade: Gerencie suas configurações de privacidade e dados.',
        'Conta: Altere senha, email e outras configurações de conta.'
      ]
    },
    {
      id: 'tips',
      title: 'Dicas e Truques',
      icon: 'lightbulb',
      isExpanded: false,
      content: [
        'Atalhos: Use gestos para navegar rapidamente entre telas.',
        'Busca Rápida: Deslize para baixo na tela inicial para acessar a busca.',
        'Modo Offline: O app funciona mesmo sem conexão com a internet.',
        'Sincronização: Suas alterações são sincronizadas automaticamente.',
        'Backup: Faça backup regularmente para não perder dados importantes.',
        'Atualizações: Mantenha o app atualizado para novas funcionalidades.'
      ]
    },
    {
      id: 'troubleshooting',
      title: 'Solução de Problemas',
      icon: 'help-circle',
      isExpanded: false,
      content: [
        'App Travando: Feche e reabra o aplicativo. Se persistir, reinicie o dispositivo.',
        'Sincronização: Verifique sua conexão com a internet e tente sincronizar manualmente.',
        'Notificações: Verifique as configurações de notificação do dispositivo.',
        'Login: Se tiver problemas para fazer login, use a opção "Esqueci minha senha".',
        'Dados Perdidos: Verifique se o backup está ativo e tente restaurar.',
        'Contato: Se o problema persistir, entre em contato com nosso suporte.'
      ]
    }
  ]);

  const toggleSection = (id: string) => {
    setManualSections(prevSections =>
      prevSections.map(section =>
        section.id === id ? { ...section, isExpanded: !section.isExpanded } : section
      )
    );
  };

  const handleContactSupport = () => {
    Linking.openURL('mailto:suporte@taskly.com?subject=Manual do Usuário - Dúvida');
  };

  const handleVideoTutorials = () => {
    Linking.openURL('https://www.youtube.com/channel/taskly-tutoriais');
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
        <Text style={styles.headerTitle}>Manual do Usuário</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollContainer}>
        {/* Introdução */}
        <View style={styles.introSection}>
          <View style={styles.introIcon}>
            <Feather name="book-open" size={40} color="#007AFF" />
          </View>
          <Text style={styles.introTitle}>Bem-vindo ao Manual do Taskly</Text>
          <Text style={styles.introSubtitle}>
            Este guia completo irá ajudá-lo a dominar todas as funcionalidades do aplicativo e aumentar sua produtividade.
          </Text>
        </View>

        {/* Seções do Manual */}
        {manualSections.map((section) => (
          <View key={section.id} style={styles.section}>
            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={() => toggleSection(section.id)}
            >
              <View style={styles.sectionIcon}>
                <Feather name={section.icon as any} size={24} color="#007AFF" />
              </View>
              <View style={styles.sectionTitleContainer}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
              </View>
              <Feather
                name={section.isExpanded ? 'chevron-up' : 'chevron-down'}
                size={20}
                color="#007AFF"
              />
            </TouchableOpacity>
            
            {section.isExpanded && (
              <View style={styles.sectionContent}>
                {section.content.map((item, index) => (
                  <View key={index} style={styles.contentItem}>
                    <View style={styles.bulletPoint} />
                    <Text style={styles.contentText}>{item}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}

        {/* Recursos Adicionais */}
        <View style={styles.additionalSection}>
          <Text style={styles.additionalTitle}>Recursos Adicionais</Text>
          
          <TouchableOpacity style={styles.additionalItem} onPress={handleVideoTutorials}>
            <View style={[styles.additionalIcon, { backgroundColor: '#FF3B30' }]}>
              <Feather name="video" size={20} color="#fff" />
            </View>
            <View style={styles.additionalInfo}>
              <Text style={styles.additionalItemTitle}>Tutoriais em Vídeo</Text>
              <Text style={styles.additionalItemSubtitle}>Aprenda visualmente com nossos vídeos</Text>
            </View>
            <Feather name="external-link" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.additionalItem} onPress={handleContactSupport}>
            <View style={[styles.additionalIcon, { backgroundColor: '#34C759' }]}>
              <Feather name="message-circle" size={20} color="#fff" />
            </View>
            <View style={styles.additionalInfo}>
              <Text style={styles.additionalItemTitle}>Suporte Personalizado</Text>
              <Text style={styles.additionalItemSubtitle}>Entre em contato para ajuda específica</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#ccc" />
          </TouchableOpacity>
        </View>

        {/* Informações de Contato */}
        <View style={styles.contactSection}>
          <Text style={styles.contactTitle}>Precisa de mais ajuda?</Text>
          <Text style={styles.contactSubtitle}>
            Nossa equipe de suporte está sempre pronta para ajudá-lo. Não hesite em entrar em contato!
          </Text>
          
          <View style={styles.contactInfo}>
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
        </View>
      </ScrollView>
    </View>
  );
}
