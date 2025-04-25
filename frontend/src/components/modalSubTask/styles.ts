import { StyleSheet } from 'react-native';
import { theme } from '@/styles/theme';

export const styles = StyleSheet.create({
    modalContainer: {
        backgroundColor: '#F0F0F0',
        borderRadius: 12,
        padding: 24,
        paddingTop: 0,
        justifyContent: 'space-around'
    },
    containerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    title: {
        width: "100%",
        textAlign: 'center',
        fontSize: 18,
        color: '#333',
        fontWeight: 'bold',
        padding: 24,
        marginBottom: 12,
        borderBottomWidth: 1,
        borderColor: theme.blue1
    },
    input: {
        fontSize: 16,
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
    circle: {
        width: 24,
        height: 24,
        borderWidth: 2,
        borderRadius: 10,
        borderColor: theme.lightGray
    },
    addButton: {
        flexDirection: 'row',
        width: "100%",
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        padding: 15,
    },
    addButtonText: {
        fontSize: 16,
        color: theme.blue1
    }

})