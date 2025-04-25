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
        gap: 20,
        flexDirection: "row",
        alignItems: "center",
    },
    textHeader: {
        flex: 1,
        fontSize: 22,
        color: theme.gray4,
        fontWeight: "700"
    },
    circle: {
        width: 24,
        height: 24,
        borderWidth: 2,
        borderRadius: 10
    },
    conclude: {
        width: 24,
        height: 24,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    containerContent: {
        flex: 1,
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
        flex: 1,
        gap: 10
    },
    text: {
        fontSize: 16,
        color: theme.white
    },
    containerCheck: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 13,
        paddingVertical: 15,
        borderBottomWidth: 1
    },
    name: {
        fontSize: 14,
        color: theme.gray3,
        width: 280
    },
    nameCheck: {
        color: theme.gray2,
        textDecorationLine: "line-through",
        width: 280
    },
    footer: {
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: "center"
    },
    completTask: {
        paddingHorizontal: 16,
        height: 48,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
    },
    delete: {
        color: theme.red
    }

})