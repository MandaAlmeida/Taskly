import { StyleSheet } from 'react-native';
import { theme } from '@/styles/theme';

export const styles = StyleSheet.create({
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10
    },
    image: {
        width: 227,
        height: 227,
    },
    title: {
        fontSize: 20,
        color: theme.gray4
    },
})