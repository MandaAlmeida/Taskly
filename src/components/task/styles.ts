import { StyleSheet } from 'react-native';
export const styles = StyleSheet.create({
    container: {
        width: "100%",
        marginBottom: 8,
        borderRadius: 8,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        minHeight: 56,
        padding: 12,
        borderWidth: 1,
    },
    check: {
        flex: 1
    },
    containerCheck: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
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
        color: "#fdfcfe",
    },
    nameCheck: {
        color: "#808080",
        textDecorationLine: "line-through",

    },
    button: {
        alignItems: "center",
        justifyContent: "center",
    },

})