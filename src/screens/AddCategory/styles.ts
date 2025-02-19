import { StyleSheet } from 'react-native';
import { theme } from '@/styles/theme';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        gap: 50,
        backgroundColor: theme.white,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 16,
        color: theme.blue1,
    },
    category: {
        flexDirection: 'row',
        borderColor: theme.blue1,
        borderWidth: 1,
        borderStyle: "solid",
        borderRadius: 6,
        height: 50,
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        color: theme.gray2,
    },
    text: {
        fontSize: 16,
        color: theme.gray2,
    }
})