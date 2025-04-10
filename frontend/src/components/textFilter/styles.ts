import { StyleSheet } from 'react-native';
import { theme } from "@/styles/theme";

export const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginVertical: 20
    },
    text: {
        fontSize: 14,
        color: theme.blue1,
    },

})