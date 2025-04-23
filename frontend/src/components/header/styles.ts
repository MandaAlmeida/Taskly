import { StyleSheet } from "react-native";
import { theme } from '@/styles/theme';

export const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: 50,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    text: {
        fontSize: 20,
        color: theme.gray4,
    },
    image: {
        width: 42,
        height: 42,
        borderRadius: 21,
    }
})