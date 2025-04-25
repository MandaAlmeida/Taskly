import { StyleSheet } from 'react-native';
import { theme } from '@/styles/theme';

export const styles = StyleSheet.create({
    modalContainer: {
        backgroundColor: '#F0F0F0',
        borderRadius: 12,
        padding: 24,
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    title: {
        fontSize: 18,
        color: '#333',
        fontWeight: 'bold',
        marginBottom: 12,
    },
    input: {
        fontSize: 24,
        color: theme.gray4,
    },
    buttonsContainer: {
        width: "100%",
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
    },
    cancelText: {
        color: '#888', fontSize: 16,
    },
    confirmButton: {
        backgroundColor: '#4285F4',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 6,
    },
    confirmText: {
        color: 'white', fontWeight: 'bold',
    },

})