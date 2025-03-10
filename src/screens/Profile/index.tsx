import { useTask } from "@/hooks/useTask";
import { Text, TouchableOpacity, View } from "react-native";

export function Profile() {
    const { deslogar } = useTask();

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
