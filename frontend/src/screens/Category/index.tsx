import { FlatList, Text, TextInput, TouchableOpacity, View } from "react-native";
import { styles } from "./styles";
import { useTask } from "@/hooks/useTask";
import { Feather } from '@expo/vector-icons';
import React, { useState } from "react";
import { Button } from "@/components/button";
import { useNavigation } from "@react-navigation/native";

import { theme } from '@/styles/theme';
import { AddCategory } from "@/components/addCategory";
import { Trash2 } from "lucide-react-native";

export function Category() {
    const { setIsCreateCategoryOpen } = useTask()
    const navigate = useNavigation();
    const { category, removeCategory } = useTask();
    function handleBackToTask() {
        navigate.goBack()
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
                renderItem={({ item }) => (
                    <View style={[styles.category, { paddingHorizontal: 10, backgroundColor: `${item.color}50`, borderWidth: 1, borderColor: item.color }]}>
                        <Text style={styles.text}>{item.category}</Text>
                        <TouchableOpacity onPress={() => removeCategory(item.category, item._id)}>
                            <Trash2 size={16} color={theme.red} />
                        </TouchableOpacity>
                    </View>
                )}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={
                    <View style={[styles.category, { paddingLeft: 10, alignSelf: "center" }]}>
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
