import { StyleSheet } from 'react-native';
import { theme } from '@/styles/theme';

export const styles = StyleSheet.create({
    form: {
        width: "100%",
        flexDirection: "row",
        gap: 4,
        borderWidth: 1,
        borderColor: theme.gray1,
        borderRadius: 5,
        alignItems: 'center',
        padding: 5,
        paddingLeft: 12
    },
    input: {
        flex: 1,
        height: 42,
        paddingLeft: 10,
        color: theme.gray4,
        fontSize: 16,
    },
    inputFocused: {
        borderColor: theme.blue2
    },
})