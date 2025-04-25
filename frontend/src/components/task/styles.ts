import { StyleSheet } from 'react-native';
import { theme } from "@/styles/theme";

export const styles = StyleSheet.create({
    container: {
        width: "100%",
        borderRadius: 10,
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
        borderRadius: 10
    },
    containerPriority: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        height: 30,
        paddingHorizontal: 8,
        borderWidth: 1,
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
        width: 24,
        height: 24,
        borderWidth: 2,
        borderRadius: 10
    },
    conclude: {
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
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