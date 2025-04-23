import { theme } from "@/styles/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        gap: 30,
        backgroundColor: theme.white
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
    circle: {
        width: 17,
        height: 17,
        borderWidth: 2,
        borderRadius: 100
    },
    conclude: {
        width: 17,
        height: 17,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100
    },
    containerContent: {
        gap: 20
    },
    containerItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    title: {
        fontSize: 16,
        color: theme.gray4,
        flex: 1
    },
    content: {
        fontSize: 14,
        color: theme.gray4,
        backgroundColor: theme.lightGray,
        padding: 16,
        paddingVertical: 8,
        borderRadius: 10,
        height: 37
    },
    subTasks: {
        flexDirection: "row",
        gap: 10,
        height: 232
    },
    delete: {
        color: theme.red
    },
    editTask: {
        backgroundColor: theme.blue1,
        height: 48,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10
    },
    text: {
        fontSize: 16,
        color: theme.white
    }

})