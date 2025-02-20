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
        borderColor: "#ccc",
        borderRadius: 8,
        backgroundColor: "#fff",
        width: "100%",
        maxHeight: 200,
        overflow: "hidden",
    },
    categoryItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    selectedItem: {
        backgroundColor: "#6495ED",
    },
    categoryText: {
        fontSize: 14,
        color: "#333",
        textAlign: "center",
    },
    selectedText: {
        color: "#fff",
        fontWeight: "bold",
    },
})