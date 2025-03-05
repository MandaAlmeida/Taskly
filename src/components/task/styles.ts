import { StyleSheet } from 'react-native';
import { theme } from "@/styles/theme";

export const styles = StyleSheet.create({
    container: {
        width: "100%",
        marginBottom: 8,
        borderRadius: 8,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 10,
        minHeight: 56,
        padding: 12,
        borderWidth: 1,
    },
    containerCategory: {
        flexDirection: "row",
        alignItems: "center",
    },
    check: {
        flex: 1
    },
    containerCheck: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    circle: {
        width: 17,
        height: 17,
        borderWidth: 2,
        borderRadius: 100
    },
    conclude: {
        width: 17,
        height: 17,
        padding: 2,
        borderRadius: 100
    },
    name: {
        fontSize: 14,
        color: theme.gray3,
    },
    text: {
        fontSize: 12,
        color: theme.gray2,
    },
    nameCheck: {
        color: theme.gray2,
        textDecorationLine: "line-through",

    },
    textCheck: {
        fontSize: 12,
        color: theme.gray2,
        textDecorationLine: "line-through",
    },
    button: {
        alignItems: "center",
        justifyContent: "center",
    }

})