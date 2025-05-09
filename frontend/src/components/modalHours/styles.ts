import { theme } from "@/styles/theme";
import { StyleSheet } from "react-native";

const ITEM_HEIGHT = 36;

export const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: '#00000080',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal: {
        backgroundColor: 'white',
        width: 300,
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        marginBottom: 8,
        fontWeight: 'bold',
    },
    separator: {
        height: 1,
        backgroundColor: '#ccc',
        width: '100%',
        marginBottom: 12,
    },
    pickerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    list: {
        height: ITEM_HEIGHT * 5,
        width: 60,
    },
    item: {
        height: ITEM_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectedItem: {
        backgroundColor: '#E3F2FD',
        borderRadius: 8,
    },
    itemText: {
        fontSize: 18,
        color: '#555',
    },
    selectedText: {
        fontWeight: 'bold',
        color: '#1976D2',
    },
    colon: {
        fontSize: 22,
        fontWeight: 'bold',
        marginHorizontal: 8,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
        width: '100%',
        paddingHorizontal: 8,
    },
    cancel: {
        color: '#1976D2',
        fontSize: 16,
    },
    confirmBtn: {
        backgroundColor: '#1976D2',
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 4,
    },
    confirmText: {
        color: 'white',
        fontWeight: 'bold',
    },
});
