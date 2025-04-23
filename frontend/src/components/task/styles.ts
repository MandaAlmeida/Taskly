import { StyleSheet } from 'react-native';
import { theme } from "@/styles/theme";

export const styles = StyleSheet.create({
    container: {
        width: "100%",
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
        borderRadius: 4
    },
    containerPriority: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        height: 30,
        paddingHorizontal: 8,
        borderWidth: 1,
        borderRadius: 4
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
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100
    },
    name: {
        fontSize: 14,
        color: theme.gray3,
        marginBottom: 5
    },
    text: {
        fontSize: 12,
        color: theme.gray2,
    },
    nameCheck: {
        color: theme.gray2,
        textDecorationLine: "line-through",
        marginBottom: 5
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