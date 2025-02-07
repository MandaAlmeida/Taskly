import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#131016",
    },
    containerHeader: {
        width: "100%",
        backgroundColor: "#0D0D0D",
        padding: 24,
        alignItems: "center",
        gap: 30,
    },
    input: {
        flex: 1,
        height: 42,
        backgroundColor: "#1F1E25",
        borderRadius: 5,
        padding: 10,
        color: "#fdfcfe",
        fontSize: 16,
    },
    inputFocused: {
        borderColor: '#5E60CE',
        borderWidth: 1,
    },
    form: {
        width: "100%",
        flexDirection: "row",
        gap: 4,
    },
    button: {
        width: 42,
        height: 42,
        borderRadius: 5,
        backgroundColor: "#1E6F9F",
        alignItems: "center",
        justifyContent: "center",
    },
    month: {
        width: "100%",
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

    },
    text: {
        color: "#fdfcfe",
        fontSize: 16,
    },
    category: {
        width: "100%",
        height: 42,
        backgroundColor: "#21506C",
        borderRadius: 6,

    },
    buttonCategory: {
        height: "100%",
        paddingHorizontal: 16,
        justifyContent: 'center',
    },
    containerList: {
        paddingHorizontal: 24,
    },
    list: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    listContent: {
        flexDirection: "row",
        gap: 8,
    },
    textCreate: {
        color: "#4EA8DE",
        fontSize: 14,
        fontWeight: "bold",
    },
    textConclude: {
        color: "#8284FA",
        fontSize: 14,
        fontWeight: "bold",
    },
    textCount: {
        backgroundColor: "#333333",
        width: 25,
        textAlign: 'center',
        color: "#D9D9D9",
        fontSize: 12,
        fontWeight: "bold",
        borderRadius: 100,
    },
    afterElement: {
        width: "100%",
        height: 1,
        backgroundColor: "#333333",
        marginBottom: 48
    },
    containerListEmpty: {
        alignItems: "center",
    },
    textBoldListEmpty: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#808080",
        marginTop: 16
    },
    textListEmpty: {
        fontSize: 14,
        color: "#808080",

    },
    buttonTask: {
        position: 'absolute',
        bottom: 30,
        right: 20,
        backgroundColor: "#4EA8DE",
        width: 40,
        height: 40,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },
})