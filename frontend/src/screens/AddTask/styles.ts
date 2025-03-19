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
    text: {
        fontSize: 16,
        color: theme.gray2,
    },
    priority: {
        gap: 10,
        borderColor: theme.blue1,
        borderWidth: 1,
        borderStyle: "solid",
        borderRadius: 6,
        padding: 10
    },
    button: {
        position: 'relative',
        height: 50,
        borderColor: theme.blue1,
        borderWidth: 1,
        borderStyle: "solid",
        borderRadius: 6,
        paddingHorizontal: 10,
        alignItems: 'center',
        flexDirection: 'row',
        gap: 5
    },
    buttonAddCategory: {
        height: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        alignItems: 'center',
    },
    date: {
        fontSize: 16,
        color: theme.gray4
    },
    error: {
        fontSize: 14,
        marginTop: 7,
        color: theme.red,
    }
})