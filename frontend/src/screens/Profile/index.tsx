import { useTask } from "@/hooks/useTask";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Text, TouchableOpacity, View, Alert, ScrollView, Image } from "react-native";
import { StackParamList } from "@/routes/app.routes";
import { Feather } from "@expo/vector-icons";
import { styles } from "./styles";

type NavigationProps = NativeStackNavigationProp<StackParamList>;

export function Profile() {
    const { deslogar, data } = useTask();
    const navigation = useNavigation<NavigationProps>();

    // Verificar se a função deslogar existe no contexto
    if (!deslogar) {
        console.error("Função deslogar não encontrada no contexto");
        return null;
    }

    function handleLogout() {
        Alert.alert(
            "Sair",
            "Deseja realmente sair da aplicação?",
            [
                {
                    text: "Cancelar",
                    style: "cancel",
                },
                {
                    text: "Sair",
                    style: "destructive",
                    onPress: () => {
                        try {
                            deslogar();
                        } catch (error) {
                            console.error("Erro ao fazer logout:", error);
                            Alert.alert("Erro", "Não foi possível fazer logout. Tente novamente.");
                        }
                    },
                },
            ]
        );
    }

    function handleEditProfile() {
        navigation.navigate("editProfile");
    }

    function handleSettings() {
        navigation.navigate("settings");
    }

    function handleHelp() {
        navigation.navigate("help");
    }

    function handleAbout() {
        navigation.navigate("about");
    }

    function handlePrivacyPolicy() {
        navigation.navigate("privacyPolicy");
    }

    function handleTermsOfService() {
        navigation.navigate("termsOfService");
    }

    return (
        <ScrollView style={styles.container}>
            {/* Header com botão de voltar */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={24} color="#007AFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Perfil</Text>
                <View style={styles.placeholder} />
            </View>

            {/* Header do Perfil */}
            <View style={styles.profileHeader}>
                <View style={styles.avatarContainer}>
                    {data.user?.imageUser ? (
                        <Image source={{ uri: data.user.imageUser }} style={styles.avatar} />
                    ) : (
                        <View style={styles.defaultAvatar}>
                            <Feather name="user" size={40} color="#666" />
                        </View>
                    )}
                    <TouchableOpacity style={styles.editAvatarButton}>
                        <Feather name="camera" size={16} color="#fff" />
                    </TouchableOpacity>
                </View>
                
                <Text style={styles.userName}>{data.user?.name || "Usuário"}</Text>
                <Text style={styles.userEmail}>{data.user?.email || "email@exemplo.com"}</Text>
                
                <TouchableOpacity style={styles.editProfileButton} onPress={handleEditProfile}>
                    <Feather name="edit-3" size={16} color="#007AFF" />
                    <Text style={styles.editProfileText}>Editar Perfil</Text>
                </TouchableOpacity>
            </View>

            {/* Seção de Estatísticas */}
            <View style={styles.statsSection}>
                <Text style={styles.sectionTitle}>Estatísticas</Text>
                <View style={styles.statsGrid}>
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>{data.tasks?.length || 0}</Text>
                        <Text style={styles.statLabel}>Tarefas</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>{data.annotation?.length || 0}</Text>
                        <Text style={styles.statLabel}>Anotações</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>{data.categories?.length || 0}</Text>
                        <Text style={styles.statLabel}>Categorias</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>{data.groups?.length || 0}</Text>
                        <Text style={styles.statLabel}>Grupos</Text>
                    </View>
                </View>
            </View>

            {/* Menu de Opções */}
            <View style={styles.menuSection}>
                <Text style={styles.sectionTitle}>Configurações</Text>
                
                <TouchableOpacity style={styles.menuItem} onPress={handleSettings}>
                    <View style={styles.menuItemLeft}>
                        <View style={[styles.menuIcon, { backgroundColor: '#007AFF' }]}>
                            <Feather name="settings" size={20} color="#fff" />
                        </View>
                        <Text style={styles.menuText}>Configurações</Text>
                    </View>
                    <Feather name="chevron-right" size={20} color="#ccc" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem} onPress={handleHelp}>
                    <View style={styles.menuItemLeft}>
                        <View style={[styles.menuIcon, { backgroundColor: '#34C759' }]}>
                            <Feather name="help-circle" size={20} color="#fff" />
                        </View>
                        <Text style={styles.menuText}>Ajuda e Suporte</Text>
                    </View>
                    <Feather name="chevron-right" size={20} color="#ccc" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem} onPress={handleAbout}>
                    <View style={styles.menuItemLeft}>
                        <View style={[styles.menuIcon, { backgroundColor: '#FF9500' }]}>
                            <Feather name="info" size={20} color="#fff" />
                        </View>
                        <Text style={styles.menuText}>Sobre o App</Text>
                    </View>
                    <Feather name="chevron-right" size={20} color="#ccc" />
                </TouchableOpacity>
            </View>

            {/* Seção Legal */}
            <View style={styles.legalSection}>
                <Text style={styles.sectionTitle}>Informações Legais</Text>
                
                <TouchableOpacity style={styles.menuItem} onPress={handlePrivacyPolicy}>
                    <View style={styles.menuItemLeft}>
                        <View style={[styles.menuIcon, { backgroundColor: '#8E8E93' }]}>
                            <Feather name="shield" size={20} color="#fff" />
                        </View>
                        <Text style={styles.menuText}>Política de Privacidade</Text>
                    </View>
                    <Feather name="chevron-right" size={20} color="#ccc" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem} onPress={handleTermsOfService}>
                    <View style={styles.menuItemLeft}>
                        <View style={[styles.menuIcon, { backgroundColor: '#8E8E93' }]}>
                            <Feather name="file-text" size={20} color="#fff" />
                        </View>
                        <Text style={styles.menuText}>Termos de Uso</Text>
                    </View>
                    <Feather name="chevron-right" size={20} color="#ccc" />
                </TouchableOpacity>
            </View>

            {/* Botão de Logout */}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Feather name="log-out" size={20} color="#fff" />
                <Text style={styles.logoutButtonText}>Sair da Conta</Text>
            </TouchableOpacity>

            {/* Versão do App */}
            <View style={styles.versionContainer}>
                <Text style={styles.versionText}>Versão 1.0.0</Text>
            </View>
        </ScrollView>
    );
}
