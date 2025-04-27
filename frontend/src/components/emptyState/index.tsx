import ImageHome from "@/assets/Checklist-rafiki.png";
import { Text, View, Image } from "react-native"
import { styles } from "./styles";

type Props = {
    title: string
    text: string
}

export function EmptyState({ text, title }: Props) {
    return (
        <View style={styles.emptyContainer}>
            <Image source={ImageHome} style={styles.image} />
            <Text style={styles.title}>{title}</Text>
            <Text>Toque em "+" para adicionar suas {text}</Text>
        </View>
    )
}