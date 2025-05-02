import { theme } from "@/styles/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: theme.white,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 24
    },
    textHeader: {
        fontSize: 22,
        color: theme.gray4,
        fontWeight: "700"
    },
    menuEdit: {
        zIndex: 1,
        position: "absolute",
        top: 30,
        backgroundColor: theme.white,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: `${theme.blue1}40`
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        padding: 20
    },
    menuText: {
        fontSize: 16
    },
    containerContent: {
        gap: 20,
    },
    title: {
        fontSize: 20,
        color: theme.gray4,
        fontWeight: "700",
        marginBottom: 20
    },
    content: {
        fontSize: 16,
        color: theme.gray3,
    },
    image: {
        width: 260,
        height: 195,
        borderRadius: 10,
        alignSelf: "center"
    },
    footer: {
        backgroundColor: theme.white,
        gap: 12,
        marginVertical: 24,
    },
    textFooter: {
        fontSize: 14,
        color: theme.gray1
    }
})