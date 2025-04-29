import { useTask } from "@/hooks/useTask";
import { useNavigation } from "@react-navigation/native";
import { Text, TouchableOpacity, View } from "react-native";

export function Profile() {
    const { deslogar } = useTask();
    const { navigate } = useNavigation();

    function handleWelcome() {
        navigate("welcome");
    }

    return (
        <View>
            <Text>
                Perfil
            </Text>
            <TouchableOpacity onPress={deslogar}>
                <Text>Sair</Text>
            </TouchableOpacity>
        </View>
    )
}
