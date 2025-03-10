import { StyleSheet } from 'react-native';
import { theme } from '@/styles/theme';

type Props = {
    focused: boolean
}

export const styles = StyleSheet.create({
    tabBar: {
        height: 80,
        backgroundColor: theme.blue1,
    },
    addButton: {
        width: 60,
        height: 60,
        backgroundColor: theme.blue2,
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        top: -30,
        alignSelf: "center",
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 3 },
        elevation: 5,
    },
    button: {
        width: 70,
        height: 70,
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
        borderRadius: "100%",
        marginTop: 40
    },
    text: {
        fontSize: 11,
        color: theme.white
    }
})