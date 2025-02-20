import { useTask } from "@/hooks/useTask";
import { TouchableOpacity, View, Text, FlatList } from "react-native";

import { styles } from "./styles";

type Props = {
    selectedCategory: string;
    setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
    isAddTask?: boolean
}

export function SelectCategory({ selectedCategory, setSelectedCategory, isAddTask = false }: Props) {
    const { category, setIsDropdownOpen } = useTask();


    return (
        <View style={styles.dropdownList}>
            <FlatList
                data={isAddTask ? category.filter(item => item !== 'Todas') : category}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[styles.categoryItem, selectedCategory === item && styles.selectedItem]}
                        onPress={() => {
                            setSelectedCategory(item);
                            setIsDropdownOpen(false);
                        }}
                    >
                        <Text
                            style={[
                                styles.categoryText,
                                selectedCategory === item && styles.selectedText,
                            ]}
                        >
                            {item}
                        </Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    )
}