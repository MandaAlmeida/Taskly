import { theme } from "@/styles/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.white,
        gap: 20,
        padding: 24
    },
    header: {
        flexDirection: "row",
        alignItems: "center"
    },
    title: {
        flex: 1,
        textAlign: "center",
        fontSize: 20,
        fontWeight: "700",
    },
    attachment: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 20,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderRadius: 10,
        gap: 20
    },
    text: {
        flex: 1,
        fontSize: 12
    }
})