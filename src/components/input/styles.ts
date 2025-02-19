import { StyleSheet } from "react-native";
import { theme } from '@/styles/theme';

export const styles = StyleSheet.create({
    input: {
        height: 50,
        borderColor: theme.blue1,
        borderWidth: 1,
        borderStyle: "solid",
        borderRadius: 6,
        paddingHorizontal: 10,
        fontSize: 16,
        color: theme.gray4
    },
    inputFocused: {

    },
    error: {
        fontSize: 14,
        marginTop: 7,
        color: theme.red,
    }

})