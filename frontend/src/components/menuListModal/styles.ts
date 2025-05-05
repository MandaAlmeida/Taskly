import { theme } from '@/styles/theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.20)',
        zIndex: 1,
    },
    container: {
        zIndex: 2,
        flex: 1,
        backgroundColor: theme.white,
        width: 240,
        gap: 40,
        padding: 40,
        paddingHorizontal: 24
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: theme.gray4
    },
    containerTitle: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    categoryBox: {
        width: "100%",
        borderRadius: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        padding: 10,
    },
    categoryText: {
        color: theme.gray3,
        fontSize: 16,
    },
    categoryContainer: {
        flexDirection: 'row',
        gap: 10,
    }
});
