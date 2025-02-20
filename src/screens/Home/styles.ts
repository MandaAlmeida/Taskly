import { StyleSheet } from "react-native";
import { theme } from '@/styles/theme';


export const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        gap: 20
    },
    section: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    text: {
        color: theme.blue1,
    },
    name: {
        color: theme.blue2,
        fontWeight: "700",
        fontSize: 16
    },
    button: {
        flexDirection: "row",
        borderRadius: 6,
        padding: 5,
        paddingHorizontal: 10,
        backgroundColor: theme.blue1,
        justifyContent: "center",
        alignItems: "center",
        gap: 10
    },
    count: {
        alignItems: "center",
        padding: 15,
        borderRadius: 6,
        marginTop: 30,
        marginBottom: 40
    },
    textbutton: {
        color: theme.white,
    },
})