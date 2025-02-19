import { StyleSheet } from "react-native";
import { theme } from '@/styles/theme';

export const styles = StyleSheet.create({
    container: {
        position: "relative",
        width: "100%",
    },
    group: {
        width: "100%",
        height: 56,
        flexDirection: "row",
        alignItems: "center",
        overflow: "hidden",
        borderWidth: 2,
        borderRadius: 6,
    },
    icon: {
        height: 56,
        width: 56,
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        borderRightWidth: 2,
    },
    control: {
        flex: 1,
        paddingLeft: 16,
        fontSize: 16,
        color: theme.gray4
    },
    error: {
        fontSize: 14,
        marginTop: 5,
        color: theme.red,
    }
})