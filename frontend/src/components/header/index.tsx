import { View, Text, TouchableOpacity } from "react-native";
import { AlignJustify } from 'lucide-react-native';
import { styles } from "./styles";
import { theme } from "@/styles/theme";

type Props = {
    text: string
}

export function Header({ text }: Props) {
    return (
        <View style={styles.container}>
            <TouchableOpacity>
                <AlignJustify color={theme.gray4} size={24} />
            </TouchableOpacity>
            <Text style={styles.text}>{text}</Text>
            <TouchableOpacity style={styles.user}>
            </TouchableOpacity>
        </View>
    )
}