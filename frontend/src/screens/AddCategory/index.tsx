import { FlatList, Text, TextInput, TouchableOpacity, View } from "react-native";
import { styles } from "./styles";
import { useTask } from "@/hooks/useTask";
import { Feather } from '@expo/vector-icons';
import React, { useState } from "react";
import { Button } from "@/components/button";
import { useNavigation } from "@react-navigation/native";

import { theme } from '@/styles/theme';

export function AddCategory() {
    const [addCategory, setAddCategory] = useState("");
    const { navigate } = useNavigation();
    const { category, handleAddCategory, removeCategory } = useTask();
    function handleBackToTask() {
        navigate("tasks")
    }

    function handleCategory(name: string) {
        handleAddCategory(name);
        setAddCategory("");
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Adicionar ou remover categoria</Text>
                <TouchableOpacity onPress={handleBackToTask}>
                    <Feather name="x" size={24} color={theme.gray2} />
                </TouchableOpacity>
            </View>
            <FlatList
                data={category.filter(item => item.name !== 'Todas')}
                keyExtractor={(item) => item._id!}
                ListHeaderComponent={
                    <View style={[styles.category, { paddingHorizontal: 10 }]}>
                        <Text style={styles.text}>Todas</Text>
                    </View>
                }
                renderItem={({ item }) => (
                    <View style={[styles.category, { paddingHorizontal: 10 }]}>
                        <Text style={styles.text}>{item.name}</Text>
                        <TouchableOpacity onPress={() => removeCategory(item.name, item._id)}>
                            <Feather name="trash-2" color={theme.gray2} />
                        </TouchableOpacity>
                    </View>
                )}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={
                    <View style={[styles.category, { paddingLeft: 10 }]}>
                        <TextInput
                            style={styles.text}
                            placeholderTextColor={theme.gray2}
                            placeholder="Adicionar categoria"
                            value={addCategory}
                            onChangeText={setAddCategory}
                        />
                        <Button
                            text="Adicionar categoria"
                            style={{ paddingHorizontal: 15 }}
                            onPress={() => handleCategory(addCategory)}
                        />
                    </View>
                }
            />
        </View>
    )
}
