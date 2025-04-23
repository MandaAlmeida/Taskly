import ImageHome from "@/assets/Checklist-rafiki.png";
import { Text, View, Image } from "react-native"
import { styles } from "./styles";


export function EmptyState() {
    return (
        <View style={styles.emptyContainer}>
            <Image source={ImageHome} style={styles.image} />
            <Text style={styles.title}>O que você quer fazer hoje?</Text>
            <Text>Toque em "+" para adicionar suas tarefas.</Text>
        </View>
    )
}