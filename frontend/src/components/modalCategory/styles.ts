import { theme } from '@/styles/theme';
import { StyleSheet } from 'react-native';

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
    grid: {
        gap: 12,
        justifyContent: 'center',
    },
    categoryBox: {
        width: 80,
        height: 80,
        borderRadius: 12,
        margin: 6,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
    },
    categoryText: {
        color: theme.gray3,
        marginTop: 6,
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'center',
    }
});
