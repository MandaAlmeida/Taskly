import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    buttonsContainer: {
        width: "100%",
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
    },
    cancelText: {
        color: '#888',
        fontSize: 16,
    },
    confirmButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 6,
    },
    confirmText: {
        color: 'white',
        fontWeight: 'bold',
    }
})