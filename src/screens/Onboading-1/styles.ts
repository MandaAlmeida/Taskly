import { StyleSheet } from 'react-native';
import { theme } from '@/styles/theme';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 35,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 50
    },
    image: {
        width: 213,
        height: 278
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
    },
    text: {
        fontSize: 16,
        textAlign: 'center'
    },
    containerButton: {
        width: "100%",
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginTop: 50
    },
    button: {
        height: 48,
        backgroundColor: theme.blue1,
        justifyContent: 'center',
        borderRadius: 10,
        paddingHorizontal: 24,
    },
    textButton: {
        fontSize: 16,
        color: theme.white,
        textTransform: 'uppercase'
    }

})