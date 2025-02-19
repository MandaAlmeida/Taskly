import { StyleSheet } from "react-native";
import { theme } from '@/styles/theme';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.white,
        alignItems: "center",
        padding: 24,
    },
    form: {
        flex: 1,
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        gap: 30,
    },
    title: {
        color: theme.blue1,
        fontSize: 24,
    },
    text: {
        fontSize: 16,
        color: theme.gray2
    },
    link: {
        fontSize: 16,
        color: theme.blue1,
        fontWeight: "700",
        textDecorationLine: "underline",
    },
    register: {
        alignItems: "center",
        gap: 10
    }

})