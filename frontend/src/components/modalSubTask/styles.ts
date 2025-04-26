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