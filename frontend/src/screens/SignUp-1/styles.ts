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
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        width: '90%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    modalSave: {
        color: theme.blue1,
        fontWeight: 'bold'
    },
    monthYearPicker: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    monthYearText: {
        fontSize: 16,
        fontWeight: '500'
    }


})