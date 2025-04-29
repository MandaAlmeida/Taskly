import { StyleSheet } from 'react-native';
import { theme } from '@/styles/theme';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: theme.white
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 56
    },
    title: {
        fontSize: 20,
        color: theme.gray4,
        fontWeight: '700'
    },
    text: {
        fontSize: 16,
        color: theme.gray2,
    },
    input: {
        width: 300,
        fontSize: 24,
        color: theme.gray4,
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
    date: {
        fontSize: 16,
        color: theme.gray4
    },
    error: {
        fontSize: 14,
        marginTop: 7,
        color: theme.red,
    },
    containerButton: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 32,
        marginBottom: 16
    },
    modal: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "rgba(0,0,0, 0.7)"

    },
    buttonSelect: {
        flexDirection: 'row',
        gap: 5,
        alignItems: 'center'
    },
    containerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    circle: {
        width: 24,
        height: 24,
        borderWidth: 2,
        borderRadius: 10,
        borderColor: theme.lightGray
    },
    addButton: {
        flexDirection: 'row',
        width: "100%",
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        padding: 15,
    },
    addButtonText: {
        fontSize: 16,
        color: theme.blue1
    }
})