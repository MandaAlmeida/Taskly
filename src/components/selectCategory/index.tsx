import { useTask } from "@/hooks/useTask";
import { TouchableOpacity, View, Text, FlatList } from "react-native";

import { styles } from "./styles";

type Props = {
    selectedCategory: string;
    setSelectedCategory: (category: string) => void;
    isAddTask?: boolean
}

export function SelectCategory({ selectedCategory, setSelectedCategory, isAddTask = false }: Props) {
    const { category, setIsDropdownOpen } = useTask();


    return (
        <View style={styles.dropdownList}>
            <FlatList
                data={isAddTask ? category.filter(item => item.name !== 'Todas') : category}
                keyExtractor={(item) => item._id!}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[styles.categoryItem, selectedCategory === item.name && styles.selectedItem]}
                        onPress={() => {
                            setSelectedCategory(item.name);
                            setIsDropdownOpen(false);
                        }}
                    >
                        <Text
                            style={[
                                styles.categoryText,
                                selectedCategory === item.name && styles.selectedText,
                            ]}
                        >
                            {item.name}
                        </Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    )
}