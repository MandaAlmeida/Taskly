import { StyleSheet } from "react-native";
import { theme } from '@/styles/theme';

export const styles = StyleSheet.create({
    container: {
        position: "relative",
        width: "100%",
    },
    containerInput: {
        position: "relative",
        height: 80,
        gap: 8
    },
    label: {
        fontSize: 16,
        color: theme.gray4
    },
    input: {
        height: 48,
        alignItems: "center",
        overflow: "hidden",
        borderWidth: 1,
        borderRadius: 10,
        flex: 1,
        paddingLeft: 16,
        fontSize: 16,
        color: theme.gray4
    },
    error: {
        fontSize: 14,
        marginTop: 5,
        color: theme.red,
    },
    iconRight: {
        position: 'absolute',
        right: 20,
        top: 45,
        zIndex: 100
    },
})