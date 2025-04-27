import { theme } from "@/styles/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    modal: {
        flex: 1,
        backgroundColor: theme.white,
        padding: 24,
        paddingBottom: 50,
        justifyContent: "space-between",
    },
    container: {
        gap: 20
    },
    containerInput: {
        gap: 10
    },
    title: {
        fontSize: 16,
        fontWeight: "700",
        color: theme.gray4
    },
    text: {
        fontSize: 16,
        color: theme.gray3
    },
    input: {
        fontSize: 16,
        color: theme.gray4,
        padding: 12,
        borderRadius: 10,
        height: 48,
        borderWidth: 1,
        borderColor: theme.blue1
    },
    containerColor: {
        paddingVertical: 16,
        gap: 12,
    },
    circle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center"
    },
    selected: {
        borderWidth: 3,
        borderColor: theme.gray4,
    },
    selectedIcon: {
        backgroundColor: theme.blue1
    },
    containerButton: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 24
    },
    cancelText: {
        color: theme.blue1,
        fontSize: 16,
    },
    button: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 6,
    },
    confirmText: {
        color: theme.white,
        fontSize: 16,
    },
})