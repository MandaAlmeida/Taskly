import { FlatList, Text, TextInput, TouchableOpacity, View } from "react-native";
import { styles } from "./styles";
import { useTask } from "@/hooks/useTask";
import { Feather } from '@expo/vector-icons';
import React, { useState } from "react";
import { Button } from "@/components/button";
import { useNavigation } from "@react-navigation/native";

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
                    <Feather name="x" size={24} color="#F4F4F4" />
                </TouchableOpacity>
            </View>
            <FlatList
                data={category.filter(item => item !== 'Todas')}
                keyExtractor={(index) => index.toString()}
                ListHeaderComponent={
                    <View style={[styles.category, { paddingHorizontal: 10 }]}>
                        <Text style={styles.text}>Todas</Text>
                    </View>
                }
                renderItem={({ item }) => (
                    <View style={[styles.category, { paddingHorizontal: 10 }]}>
                        <Text style={styles.text}>{item}</Text>
                        <TouchableOpacity onPress={() => removeCategory(item)}>
                            <Feather name="trash-2" color="#808080" />
                        </TouchableOpacity>
                    </View>
                )}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={
                    <View style={[styles.category, { paddingLeft: 10 }]}>
                        <TextInput
                            style={styles.text}
                            placeholderTextColor={"#808080"}
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
