import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#131016",
        alignItems: "center",
        padding: 24,
    },
    form: {
        flex: 1,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        gap: 30,
    },
    title: {
        color: "#F4F4F4",
        fontSize: 24,
    },
    text: {
        fontSize: 16,
        color: "#7C7C8A"
    },
    link: {
        fontSize: 16,
        color: "#4EA8DE",
        fontWeight: "700",
        textDecorationLine: "underline",
    },
    register: {
        alignItems: "center",
        gap: 10
    }

})