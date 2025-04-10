import { theme } from "@/styles/theme";
import { useState } from "react";
import { TextInput, TouchableOpacity, View } from "react-native";
import { styles } from "./styles";
import { useTask } from "@/hooks/useTask";
import { Search as SearchIcon } from 'lucide-react-native';

export function Search() {
    const [isFocused, setIsFocused] = useState(false);
    const {
        selectedCategory,
        fetchTaskByCategory,
        setTaskName,
    } = useTask();

    return (
        <View style={styles.form}>
            <TouchableOpacity>
                <SearchIcon color={theme.gray2} size={24} />
            </TouchableOpacity>
            <TextInput
                style={[styles.input, isFocused && styles.inputFocused]}
                placeholder="Pesquisar tarefa"
                placeholderTextColor={theme.gray2}
                onChangeText={(text) => {
                    setTaskName(text);
                    fetchTaskByCategory(selectedCategory, undefined, text);
                }}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
            />
        </View>
    )
}