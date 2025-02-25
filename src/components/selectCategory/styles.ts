import { StyleSheet } from "react-native";
import { theme } from '@/styles/theme';


export const styles = StyleSheet.create({
    textbutton: {
        color: theme.white,
    },
    dropdownList: {
        position: "absolute",
        right: 0,
        top: 35,
        zIndex: 100,
        borderWidth: 1,
        borderColor: theme.gray2,
        borderRadius: 8,
        backgroundColor: theme.white,
        width: "100%",
        maxHeight: 200,
        overflow: "hidden",
    },
    categoryItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: theme.lightGray,
    },
    selectedItem: {
        backgroundColor: theme.blue1,
    },
    categoryText: {
        fontSize: 14,
        color: theme.gray2,
        textAlign: "center",
    },
    selectedText: {
        color: theme.white,
        fontWeight: "bold",
    },
})