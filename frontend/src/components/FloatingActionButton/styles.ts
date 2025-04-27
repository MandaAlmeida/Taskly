import { StyleSheet } from 'react-native';
import { theme } from '@/styles/theme';

type Props = {
    focused: boolean
}

export const styles = StyleSheet.create({
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
    }
})