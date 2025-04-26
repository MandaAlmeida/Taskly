import { StyleSheet } from "react-native";
import { theme } from '@/styles/theme';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.white,
        padding: 24,
    },
    previous: {
        width: "100%",
        alignItems: "flex-start",
    },
    form: {
        flex: 1,
        marginTop: 41,
        width: "100%",
        gap: 25,
    },
    title: {
        color: theme.blue1,
        fontSize: 32,
        fontWeight: 700,
        marginBottom: 28,
    },
    text: {
        fontSize: 14,
        color: theme.gray2
    },
    button: {
        width: "100%",
        backgroundColor: theme.blue1,
        marginTop: 44
    },
    link: {
        fontSize: 14,
        color: theme.blue1,
    },
    register: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
    },
    error: {
        fontSize: 14,
        marginTop: 5,
        color: theme.red,
    },
    containerInput: {
        height: 80,
        gap: 8
    },
    calendar: {
        backgroundColor: "transparent"
    },
    input: {
        height: 50,
        borderColor: theme.blue1,
        borderWidth: 1,
        borderStyle: "solid",
        borderRadius: 6,
        paddingHorizontal: 10,
        justifyContent: "center"
    },
    textInput: {
        fontSize: 16,
        color: theme.gray4
    }

})