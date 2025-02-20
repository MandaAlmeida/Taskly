import { StyleSheet } from 'react-native';
import { theme } from '@/styles/theme';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    containerHeader: {
        width: "100%",
        padding: 24,
        alignItems: "center",
        gap: 30,
    },
    input: {
        flex: 1,
        height: 42,
        borderWidth: 1,
        borderColor: theme.blue1,
        borderRadius: 5,
        padding: 10,
        color: theme.gray4,
        fontSize: 16,
    },
    inputFocused: {
        borderColor: theme.blue2
    },
    form: {
        width: "100%",
        flexDirection: "row",
        gap: 4,
    },
    button: {
        width: 42,
        height: 42,
        borderRadius: 5,
        backgroundColor: theme.blue1,
        alignItems: "center",
        justifyContent: "center",
    },
    month: {
        width: "100%",
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

    },
    text: {
        color: theme.blue1,
        fontSize: 16,
    },
    category: {
        width: "100%",
        height: 42,
        backgroundColor: theme.blue2,
        borderRadius: 6,

    },
    buttonCategory: {
        height: "100%",
        paddingHorizontal: 16,
        justifyContent: 'center',
    },
    containerList: {
        paddingHorizontal: 24,
    },
    list: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    listContent: {
        flexDirection: "row",
        gap: 8,
    },
    textCreate: {
        color: theme.blue1,
        fontSize: 14,
        fontWeight: "bold",
    },
    textConclude: {
        color: theme.green1,
        fontSize: 14,
        fontWeight: "bold",
    },
    textCount: {
        width: 25,
        textAlign: 'center',
        color: theme.white,
        fontSize: 12,
        fontWeight: "bold",
        borderRadius: 100,
    },
    buttonTask: {
        position: 'absolute',
        bottom: 30,
        right: 20,
        backgroundColor: theme.blue1,
        width: 40,
        height: 40,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },
})