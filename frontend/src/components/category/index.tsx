import { TouchableOpacity, Text } from "react-native";
import { styles } from "./styles";

type Props = {
    text: string,
    isFocus?: boolean,
    Focused?: () => void,
}

export function Category({ text, isFocus = false, Focused }: Props) {
    return (
        <TouchableOpacity style={[styles.button, {
            backgroundColor: isFocus ? "#4EA8DE" : "transparent"
        }]} onPress={Focused}>
            <Text style={styles.text}>{text}</Text>
        </TouchableOpacity>
    )
}