import { StyleSheet } from 'react-native';
import { theme } from '@/styles/theme';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        gap: 20
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    card: {
        padding: 10,
        borderRadius: 10,
        borderWidth: 1,
        gap: 10
    },
    cardSmall: {
        width: 170,
        height: 174,
        marginBottom: 20,
    },
    cardLarge: {
        width: '100%',
        height: 174,
        marginBottom: 20,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    description: {
        flex: 1,
        fontSize: 14,
        color: theme.gray3
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    date: {
        color: theme.gray3,
        fontSize: 12,
    },
    tag: {
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 10,
        fontSize: 12,
        fontWeight: 'bold',
        color: theme.white
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 24
    },
    textHeader: {
        fontSize: 22,
        color: theme.gray4,
        fontWeight: "700"
    },
    menuEdit: {
        zIndex: 1,
        position: "absolute",
        top: 30,
        backgroundColor: theme.white,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: `${theme.blue1}40`
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        padding: 20
    },
    menuText: {
        fontSize: 16
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1,
    }
});
