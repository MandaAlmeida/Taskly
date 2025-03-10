import { View, Text, TouchableOpacity, Image } from "react-native";
import ImageOnboading from "@/assets/Onboarding-1.png";
import { styles } from "./styles";
import { Progress } from "@/components/progress";

export function Onboading1() {
    return (
        <View style={styles.container}>
            <Image source={ImageOnboading} style={styles.image} />
            <Progress count={1} />
            <Text style={styles.title}>Gerencie suas tarefas</Text>
            <Text style={styles.text}>Você pode gerenciar facilmente todas as suas tarefas diárias no TaskLy de graça.</Text>
            <View style={styles.containerButton}>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.textButton}>
                        Proximo
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}