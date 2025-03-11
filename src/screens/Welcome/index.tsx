import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "./styles";
import { theme } from "@/styles/theme";
import { Feather } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";

export function Welcome() {
    const { navigate } = useNavigation();

    function handleNextOnboading() {
        navigate("onboading3");
    }

    function handleLogin() {
        navigate("signIn");
    }

    function handleRegister() {
        navigate("signUp");
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.previous} onPress={handleNextOnboading} >
                <Feather name="chevron-left" size={30} color={theme.gray4} />
            </TouchableOpacity>
            <View style={styles.containerText}>
                <Text style={styles.title}>
                    Bem-vindo ao TaskLy
                </Text>
                <Text style={styles.text}>
                    Por favor, faça login na sua conta ou crie uma nova conta para continuar.
                </Text>
            </View>
            <View style={styles.containerButton}>
                <TouchableOpacity style={[styles.button, { backgroundColor: theme.blue1 }]} onPress={handleLogin}>
                    <Text style={styles.textButton}>Fazer Login</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleRegister}>
                    <Text style={[styles.textButton, { color: theme.blue1 }]}>Criar Conta</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}