import { FlatList, Text, TextInput, TouchableOpacity, View } from "react-native";
import { styles } from "./styles";
import { useTask } from "@/hooks/useTask";
import { Feather } from '@expo/vector-icons';
import React, { useState } from "react";
import { Button } from "@/components/button";
import { useNavigation } from "@react-navigation/native";

import { theme } from '@/styles/theme';
import { AddCategory } from "@/components/addCategory";

type category = {
    name: string,
    icon: string,
    color: string
}

export function Category() {
    const { setIsCreateCategoryOpen } = useTask()
    const [addCategory, setAddCategory] = useState<category>({
        name: "",
        icon: "",
        color: ""
    });
    const navigate = useNavigation();
    const { category, handleAddCategory, removeCategory } = useTask();
    function handleBackToTask() {
        navigate.goBack()
    }

    function handleCategory(name: string, icon: number, color: string) {
        handleAddCategory(name, icon, color);
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
                data={category.filter(item => item.category !== 'Todas')}
                keyExtractor={(item) => item._id!}
                ListHeaderComponent={
                    <View style={[styles.category, { paddingHorizontal: 10 }]}>
                        <Text style={styles.text}>Todas</Text>
                    </View>
                }
                renderItem={({ item }) => (
                    <View style={[styles.category, { paddingHorizontal: 10 }]}>
                        <Text style={styles.text}>{item.category}</Text>
                        <TouchableOpacity onPress={() => removeCategory(item.category, item._id)}>
                            <Feather name="trash-2" color={theme.gray2} />
                        </TouchableOpacity>
                    </View>
                )}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={
                    <View style={[styles.category, { paddingLeft: 10 }]}>
                        <Button
                            text="Adicionar categoria"
                            style={{ paddingHorizontal: 15 }}
                            onPress={() => setIsCreateCategoryOpen(true)}
                        />
                    </View>
                }
            />

            <AddCategory title="Categoria" />
        </View>
    )
}
