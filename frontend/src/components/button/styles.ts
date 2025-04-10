import { StyleSheet } from "react-native";
import { theme } from '@/styles/theme';

export const styles = StyleSheet.create({
    button: {
        backgroundColor: theme.blue1,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        height: 50
    },
    text: {
        fontSize: 16,
        color: theme.white,
    },
})