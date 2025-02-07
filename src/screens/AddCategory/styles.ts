import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        gap: 50,
        backgroundColor: "#131016",
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 16,
        color: "#808080",
    },
    category: {
        flexDirection: 'row',
        borderColor: "#333333",
        borderWidth: 1,
        borderStyle: "solid",
        borderRadius: 6,
        height: 50,
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        color: "#F4F4F4",
    },
    text: {
        fontSize: 16,
        color: "#F4F4F4",
    }
})