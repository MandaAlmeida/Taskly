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
        minHeight: 68,
        padding: 12,
        borderWidth: 1,
    },
    containerCategory: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        height: 30,
        paddingHorizontal: 8,
        backgroundColor: "#809CFF",
        borderRadius: 10
    },
    category: {
        fontSize: 12,
        color: theme.white,
    },
    containerItems: {
        gap: 12,
        flexDirection: 'row',
        alignItems: 'flex-end',
        height: "100%"
    },
    check: {
        flex: 1
    },
    containerCheck: {
        flexDirection: "row",
        alignItems: "center",
        gap: 13,
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