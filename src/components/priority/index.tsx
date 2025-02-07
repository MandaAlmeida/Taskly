import { TouchableOpacity, Text } from "react-native";
import { styles } from "./styles";

type Props = {
    text: string,
    isFocus: boolean,
    Focused: () => void
}

export function Priority({ text, Focused, isFocus }: Props) {
    return (
        <TouchableOpacity onPress={Focused} style={[styles.container, {
            borderColor: text === "Alta"
                ? "#FF3B30"
                : text === "Media"
                    ? "#ff9500"
                    : "#34C759",
            backgroundColor: isFocus ? text === 'Alta'
                ? 'rgba(255, 59, 48, 0.2)' : text === 'Media'
                    ? 'rgba(255, 149, 0, 0.2)' :
                    'rgba(52, 199, 89, 0.2)'
                : 'transparent'
        }]}>
            <Text style={styles.text}>{text}</Text>
        </TouchableOpacity>
    )
}