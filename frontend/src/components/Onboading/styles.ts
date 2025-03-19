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
    skip: {
        width: "100%",
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
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
        marginTop: 50
    },
    buttonNext: {
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
    },
    buttonPrevious: {
        fontSize: 16,
        color: theme.gray4,
        textTransform: 'uppercase'
    }

})