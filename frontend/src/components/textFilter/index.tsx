import { theme } from "@/styles/theme";
import { Text, TouchableOpacity } from "react-native";
import { styles } from "./styles";
import { ChevronDown, ChevronUp } from "lucide-react-native";

type Props = {
    number: string | number,
    text: string,
    Open: () => void,
    isOpen: boolean
}

export function TextFilter({ text, number, Open, isOpen }: Props) {
    return (
        <TouchableOpacity style={styles.container} onPress={Open}>
            <Text style={styles.text}>{text} ({number})</Text>
            {isOpen ? <ChevronUp size={16} color={theme.blue1} /> : <ChevronDown size={16} color={theme.blue1} />}
        </TouchableOpacity>
    );
}