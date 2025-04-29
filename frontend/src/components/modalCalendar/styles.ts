import { StyleSheet } from "react-native";
import { theme } from '@/styles/theme';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    openButton: {
        padding: 12,
        backgroundColor: '#4285F4',
        borderRadius: 8,
    },
    buttonText: {
        color: 'white', fontWeight: 'bold',
    },
    modalContainer: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
    },
    calendar: {
        backgroundColor: "transparent"
    }
});
