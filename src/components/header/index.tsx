import { View, Text } from "react-native";
import { styles } from "./styles";

type Props = {
    text: string
}

export function Header({ text }: Props) {
    return (
        <Text style={styles.text}>{text}</Text>
    )
}