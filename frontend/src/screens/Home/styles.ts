import { StyleSheet } from "react-native";
import { theme } from '@/styles/theme';


export const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        gap: 20
    },
    title: {
        fontSize: 20,
    },
    name: {
        fontSize: 22,
        fontWeight: "700",
        color: theme.blue1,
        marginLeft: 40
    }
})