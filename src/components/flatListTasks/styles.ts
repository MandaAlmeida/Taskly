import { StyleSheet } from 'react-native';
import { theme } from '@/styles/theme';

export const styles = StyleSheet.create({
    containerListEmpty: {
        alignItems: "center",
    },
    textBoldListEmpty: {
        fontSize: 14,
        fontWeight: "bold",
        color: theme.gray2,
        marginTop: 16
    },
    textListEmpty: {
        fontSize: 14,
        color: theme.gray2,

    },
    afterElement: {
        width: "100%",
        height: 1,
        backgroundColor: theme.blue1,
        marginBottom: 48
    }
})