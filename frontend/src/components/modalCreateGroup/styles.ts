import { StyleSheet } from 'react-native';
import { theme } from '@/styles/theme';

export const styles = StyleSheet.create({
    modalContainer: {
        backgroundColor: '#F0F0F0',
        borderRadius: 12,
        gap: 20,
        padding: 24,
        alignItems: 'center',
        justifyContent: 'space-around',
        position: 'relative'
    },
    title: {
        fontSize: 18,
        color: '#333',
        fontWeight: 'bold',
    },
    memberItem: {
        width: "100%",
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    memberText: {
        color: theme.gray1
    },
    containerInput: {
        width: "100%",
        gap: 20,
        marginTop: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: theme.blue1,
        borderRadius: 10,
        padding: 10,
        fontSize: 16,
        color: theme.gray4,
    },
    accessType: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: theme.blue1,
        borderRadius: 10,
        padding: 10,
        width: "100%"
    },
    dropdownList: {
        position: 'absolute',
        top: 160,
        zIndex: 100,
        width: "100%",
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        marginTop: 4,
        backgroundColor: theme.white,
        maxHeight: 300,
    },
    dropdownItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    addButton: {
        flexDirection: 'row',
        width: "100%",
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        padding: 10,
        borderRadius: 10,
    },
    addButtonText: {
        fontSize: 16,
        color: theme.white
    },
    groupItem: {

    }

})