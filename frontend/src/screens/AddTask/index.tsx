import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { styles } from "./styles";
import { useTask } from "@/hooks/useTask";
import { useNavigation } from "@react-navigation/native";
import { Button } from "@/components/button";
import { theme } from "@/styles/theme";
import { StackNavigationProp } from "@react-navigation/stack";
import { StackParamList } from "@/routes/app.routes";
import { ModalCalendar } from "@/components/modalCalendar";
import { ModalSubCategory } from "@/components/modalSubCategory";
import { ModalPriority } from "@/components/modalPriority";
import { ModalCategory } from "@/components/modalCategory";
import { CreateSubTaskProps } from "@/@types/task";
import { Keyboard } from "react-native";
import { Calendar1, Clock, Flag, Plus, Tag } from "lucide-react-native";
import { Calendar } from "react-native-calendars";
import { ModalHours } from "@/components/modalHours";
import { set } from "react-hook-form";

type NavigationProps = StackNavigationProp<StackParamList>;

export function AddTask() {
  const [taskName, setTaskName] = useState("");
  const navigation = useNavigation<NavigationProps>();
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>(
    {}
  );

  const { handleAddTask, data, uiState, setUiState, setData, setModalState } =
    useTask();
  const [showSubTasks, setShowSubTasks] = useState(false);
  const [localSubTasks, setLocalSubTasks] = useState<CreateSubTaskProps[]>([]);

  const hasEmptyTask = localSubTasks.some((sub) => sub.task.trim() === "");

  const disabled =
    !taskName || !data.selectedCategory || !data.priority || !uiState.date;

  function handleSubTaskChange(text: string, index: number) {
    const updatedSubTasks = [...localSubTasks];
    updatedSubTasks[index] = {
      ...updatedSubTasks[index],
      task: text,
      status: "PENDING",
    };
    setLocalSubTasks(updatedSubTasks);
  }

  function addNewSubTask() {
    setLocalSubTasks([...localSubTasks, { task: "", status: "PENDING" }]);
    focusOnNewInput(localSubTasks.length);
  }

  function toggleSection(key: string) {
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }

  function handleBackToTask() {
    navigation.navigate("tabs", { screen: "tasks" });
    setUiState((prevState) => ({
      ...prevState,
      date: {
        year: 0,
        month: 0,
        day: 0,
        timestamp: 0,
        dateString: "",
      },
    }));

    setData((prevData) => ({
      ...prevData,
      selectedSubCategory: undefined,
      priority: "",
      selectedCategory: undefined,
    }));
  }

  const inputRefs = useRef<TextInput[]>([]); // Aqui armazenamos as refs

  const focusOnNewInput = (index: number) => {
    setTimeout(() => {
      inputRefs.current[index]?.focus(); // Foca no input novo
    }, 100); // Pequeno delay para garantir que o input existe
  };

  function handleSaveTask() {
    if (
      (uiState.date.dateString === "",
      data.selectedSubCategory === undefined,
      data.priority === "")
    ) {
      return;
    }
    const task = {
      name: taskName,
      priority: data.priority,
      category: data.selectedCategory?._id,
      subCategory: data.selectedSubCategory?._id,
      date: uiState.date.dateString,
      subTask: localSubTasks,
      hours: uiState.hours,
    };

    handleAddTask(task, handleBackToTask);
    setUiState((prevState) => ({
      ...prevState,
      date: {
        year: 0,
        month: 0,
        day: 0,
        timestamp: 0,
        dateString: "",
      },
    }));
    setData((prevData) => ({
      ...prevData,
      taskName: "",
      selectedSubCategory: undefined,
      priority: "",
      selectedCategory: undefined,
    }));
  }

  useEffect(() => {
    const keyboardHideListener = Keyboard.addListener("keyboardDidHide", () => {
      if (taskName.trim() !== "") {
        setShowSubTasks(true);
      }
    });

    return () => keyboardHideListener.remove();
  }, [taskName]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Adicionar tarefa</Text>
        <TouchableOpacity onPress={handleBackToTask}>
          <Feather name="x" size={30} color={theme.gray4} />
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1 }}>
        <TextInput
          style={styles.input}
          multiline
          numberOfLines={2}
          placeholder="Escreva uma nova tarefa..."
          value={taskName}
          onChangeText={(text) => {
            if (text.includes("\n")) {
              setTaskName(text.replace("\n", "")); // remove o Enter
              if (!showSubTasks) {
                setShowSubTasks(true); // Mostra subtarefas
              }
              if (localSubTasks.length === 0) {
                addNewSubTask(); // Se não existe nenhuma subtarefa, cria
              }
            } else {
              setTaskName(text);
            }
          }}
        />

        {showSubTasks && (
          <FlatList
            data={localSubTasks}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View style={styles.containerItem}>
                <View style={styles.circle} />
                <TextInput
                  ref={(ref) => {
                    if (ref) inputRefs.current[index] = ref;
                  }}
                  style={styles.input}
                  multiline
                  numberOfLines={3}
                  placeholder="Digite a subtarefa..."
                  value={item.task}
                  onChangeText={(text) => {
                    if (text.includes("\n")) {
                      handleSubTaskChange(text.replace("\n", ""), index);
                      addNewSubTask();
                    } else {
                      handleSubTaskChange(text, index);
                    }
                  }}
                />
              </View>
            )}
            ListFooterComponent={
              !hasEmptyTask ? (
                <TouchableOpacity
                  onPress={addNewSubTask}
                  style={styles.addButton}
                >
                  <Plus color={theme.blue1} size={20} />
                  <Text style={styles.addButtonText}>Nova sub-tarefa</Text>
                </TouchableOpacity>
              ) : null
            }
          />
        )}
      </View>

      <View style={styles.containerButton}>
        <TouchableOpacity
          style={styles.buttonSelect}
          onPress={() => setModalState({ name: "isSelectDateOpen" })}
        >
          <Calendar1 size={24} color={theme.gray4} />
          {uiState.date.dateString !== "" && (
            <Text>
              {uiState.date.day <= 9
                ? `0${uiState.date.day}`
                : uiState.date.day}
              /
              {uiState.date.month <= 9
                ? `0${uiState.date.month}`
                : uiState.date.month}
              /{uiState.date.year}
            </Text>
          )}
        </TouchableOpacity>

        {uiState.date.dateString !== "" && (
          <TouchableOpacity
            style={styles.buttonSelect}
            onPress={() => setModalState({ name: "isSelectHoursOpen" })}
          >
            <Clock size={24} color={theme.gray4} />
            {uiState.hours !== undefined && <Text>{uiState.hours}</Text>}
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.buttonSelect}
          onPress={() => setModalState({ name: "isSelectCategoryOpen" })}
        >
          <Tag size={24} color={theme.gray4} />
          {data.selectedCategory !== undefined && (
            <Text>{data.selectedCategory?.category}</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonSelect}
          onPress={() => setModalState({ name: "isSelectPriorityOpen" })}
        >
          <Flag size={24} color={theme.gray4} />
          {data.priority && <Text>{data.priority}</Text>}
        </TouchableOpacity>
      </View>

      <ModalCalendar />
      <ModalCategory />
      <ModalSubCategory />
      <ModalHours />
      <ModalPriority />
      <Button
        text={"Adicionar tarefa"}
        onPress={handleSaveTask}
        style={{ width: "100%", opacity: disabled ? 0.5 : 100 }}
        disabled={disabled}
      />
    </View>
  );
}
