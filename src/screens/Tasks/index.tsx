import React, { useState } from "react"
import { FlatList, Image, Text, TextInput, TouchableOpacity, View } from "react-native"

import { styles } from "./styles"

import { Feather } from '@expo/vector-icons';

import { Task } from "@/components/task";
import { useTask } from "@/hooks/useTask";

import { useNavigation } from "@react-navigation/native";

export function Tasks() {
    const { navigate } = useNavigation();
    const { tasksCategory, category, taskConcluid, taskName, handleTaskSeek, setTaskName, handleTaskRemove, handleTaskToggle, handleFilterCategory } = useTask();
    const [isFocused, setIsFocused] = useState(false);

    function handleAddTask() {
        navigate("addTask")
    }

    return (
        <View style={styles.container}>
            <View style={styles.containerHeader}>
                <Image source={require('../../assets/logo.png')} />
                <View style={styles.form}>
                    <TextInput
                        style={[styles.input, isFocused && styles.inputFocused]}
                        placeholder='Pesquisar tarefa'
                        placeholderTextColor={"#6B6B6B"}
                        onChangeText={setTaskName}
                        value={taskName}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                    />
                    <TouchableOpacity style={styles.button} onPress={handleTaskSeek}>
                        <Feather name="search" size={18} color="#fdfcfe" />
                    </TouchableOpacity>
                </View>
                <View style={styles.month}>
                    <TouchableOpacity>
                        <Feather name="arrow-left" size={24} color="#fdfcfe" />
                    </TouchableOpacity>
                    <Text style={styles.text}>03 de Fevereiro</Text>
                    <TouchableOpacity>
                        <Feather name="arrow-right" size={24} color="#fdfcfe" />
                    </TouchableOpacity>
                </View>
                <View style={styles.category}>
                    <FlatList
                        data={category}
                        keyExtractor={item => item.length.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={styles.buttonCategory} onPress={() => handleFilterCategory(item)}>
                                <Text style={styles.text}>{item}</Text>
                            </TouchableOpacity>
                        )}
                        ListFooterComponent={
                            <TouchableOpacity style={styles.buttonCategory}>
                                <Feather name="plus" size={24} color="#fdfcfe" />
                            </TouchableOpacity>
                        }
                        horizontal
                    />

                </View>
            </View>
            <View style={styles.containerList}>
                <View style={styles.list}>
                    <View style={styles.listContent}>
                        <Text style={styles.textCreate}>Criadas </Text>
                        <Text style={styles.textCount}>{tasksCategory ? tasksCategory.length : 0}</Text></View>
                    <View style={styles.listContent}>
                        <Text style={styles.textConclude}>Concluídas</Text>
                        <Text style={styles.textCount}>{taskConcluid ? taskConcluid.length : 0}</Text>
                    </View>
                </View>
                <FlatList
                    data={tasksCategory}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <Task
                            id={item.id}
                            key={item.id}
                            name={item.name}
                            onRemove={() => handleTaskRemove(item.name)}
                            handleTaskConclue={() => handleTaskToggle(item.id)}
                            active={item.active}
                            priority={item.priority}
                        />
                    )}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={() => (
                        <View style={styles.containerListEmpty}>
                            <View style={styles.afterElement} />
                            <Feather name="clipboard" size={56} color="#333333" />
                            <Text style={styles.textBoldListEmpty}>Você ainda não tem tarefas cadastradas</Text>
                            <Text style={styles.textListEmpty}>Crie tarefas e organize seus itens a fazer</Text>
                        </View>
                    )}
                />
            </View>
            <TouchableOpacity style={styles.buttonTask} onPress={handleAddTask}>
                <Feather name="plus" size={16} color="#fdfcfe" />
            </TouchableOpacity>
        </View>
    )
}