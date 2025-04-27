import React from "react";
import { TouchableOpacity } from "react-native";
import { useNavigation, useNavigationState } from "@react-navigation/native";
import { Plus } from "lucide-react-native";
import { styles } from "./styles";

export function FloatingActionButton() {
    const navigation = useNavigation();

    const tabIndex = useNavigationState(state => {
        const routeName = state.routes[state.index].name;
        return routeName;
    });

    function handleNavigate() {
        if (tabIndex === "anotation") {
            navigation.navigate("addAnnotations");
        } else {
            navigation.navigate("addTask");
        }
    }

    return (
        <TouchableOpacity style={styles.addButton} onPress={handleNavigate}>
            <Plus size={24} color="white" />
        </TouchableOpacity>
    );
}
