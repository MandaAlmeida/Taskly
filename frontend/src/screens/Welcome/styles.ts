import { StyleSheet } from "react-native";
import { theme } from '@/styles/theme';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 35,
        alignItems: 'center',
    },
    previous: {
        width: "100%",
        alignItems: "flex-start"
    },
    containerText: {
        gap: 26,
        flex: 1,
        marginTop: 58
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        textAlign: "center"
    },
    text: {
        fontSize: 16,
        textAlign: 'center'
    },
    containerButton: {
        width: "100%",
        gap: 28
    },
    button: {
        borderRadius: 10,
        justifyContent: 'center',
        height: 50,
        width: "100%",
        borderWidth: 2,
        borderColor: theme.blue1
    },
    textButton: {
        fontSize: 16,
        color: theme.white,
        textTransform: 'uppercase',
        textAlign: "center"
    },
})