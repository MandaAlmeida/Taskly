import { Header } from "@/components/header";
import { Text, View } from "react-native";
import { styles } from "./styles";

export function Anotation() {
    return (
        <View style={styles.container}>
            <Header text="Anotações" />
            <Text>
                Anotações
            </Text>
        </View>
    )
}
