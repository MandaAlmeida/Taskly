import { FlatList, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Calendar, CalendarUtils, DateData, LocaleConfig } from 'react-native-calendars';
import { useEffect, useState } from "react";

import { Feather } from "@expo/vector-icons";

import { ptBR } from "@/utils/localeCalendarConfig";

import { styles } from "./styles";
import { theme } from "@/styles/theme";
import { Header } from "@/components/header";
import { useTask } from "@/hooks/useTask";
import { Task } from "@/components/task";
import { EmptyState } from "@/components/emptyState";
import { formatDate } from "@/utils/formatDate";
import { useNavigation } from "@react-navigation/native";
import { ChevronLeft, ChevronRight } from "lucide-react-native";


LocaleConfig.locales["pt-br"] = ptBR
LocaleConfig.defaultLocale = "pt-br"

const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];


export function Calendars() {
    const { fetchTaskByDate, fetchTaskById, data } = useTask();
    const today = new Date();
    const INITIAL_DATE = CalendarUtils.getCalendarDateString(today);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [editableYear, setEditableYear] = useState(currentDate.getFullYear().toString());
    const { navigate } = useNavigation();

    function handleBackToTask() {
        navigate("task")
    }

    function handleTask(id: string) {
        fetchTaskById(id, handleBackToTask)
    }

    const [day, setDay] = useState<DateData>({
        year: today.getFullYear(),
        month: today.getMonth() + 1,
        day: today.getDate(),
        timestamp: today.getTime(),
        dateString: INITIAL_DATE,
    });

    function handleMonthChange(direction: 'prev' | 'next') {
        const newDate = new Date(currentDate);
        newDate.setMonth(direction === 'prev' ? currentDate.getMonth() - 1 : currentDate.getMonth() + 1);
        setCurrentDate(newDate);
        setEditableYear(newDate.getFullYear().toString());
    }

    function handleYearChange(text: string) {
        setEditableYear(text);
        const newDate = new Date(currentDate);
        const numericYear = parseInt(text, 10);
        if (!isNaN(numericYear)) {
            newDate.setFullYear(numericYear);
            setCurrentDate(newDate);
        }
    }

    function handleDayPress(item: DateData) {
        setDay(item);
        fetchTaskByDate(item.dateString);
    }

    useEffect(() => {
        if (data.tasksData.length === 0) {
            fetchTaskByDate(day.dateString);
        }
    }, [data.tasksData])


    const buildMarkedDates = (selectedDate?: string) => {
        const marked: Record<string, any> = {};

        data.tasks.forEach(task => {
            const taskDate = task.date.split('T')[0];

            if (!marked[taskDate]) {
                marked[taskDate] = {
                    marked: true,
                    dotColor: theme.blue2,
                };
            }
        });

        if (selectedDate) {
            marked[selectedDate] = {
                ...(marked[selectedDate] || {}),
                selected: true,
                selectedColor: theme.blue1,
                selectedTextColor: theme.white,
            };
        }

        return marked;
    };


    return (
        <View style={styles.container}>
            <Header text="Calendario" />

            {/* Header customizado */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <TouchableOpacity onPress={() => handleMonthChange('prev')}>
                    <ChevronLeft size={24} color={theme.blue1} />
                </TouchableOpacity>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.blue2 }}>
                        {months[currentDate.getMonth()]}
                    </Text>
                    <Text> </Text>
                    <TextInput
                        value={editableYear}
                        onChangeText={handleYearChange}
                        keyboardType="numeric"
                        maxLength={4}
                        style={{
                            fontSize: 18,
                            color: theme.blue2,
                            borderBottomWidth: 1,
                            borderBottomColor: theme.blue1,
                            padding: 0,
                            width: 60,
                            textAlign: 'center',
                        }}
                    />
                </View>

                <TouchableOpacity onPress={() => handleMonthChange('next')}>
                    <ChevronRight size={24} color={theme.blue1} />
                </TouchableOpacity>
            </View>

            {/* Calendário principal */}
            <Calendar
                key={currentDate.toISOString()}
                current={currentDate.toISOString().split('T')[0]}
                style={styles.calendar}
                hideArrows={true}
                hideExtraDays={false}
                disableMonthChange={true}
                renderHeader={() => null}
                theme={{
                    textMonthFontSize: 18,
                    textSectionTitleColor: theme.blue1,
                    monthTextColor: theme.blue2,
                    todayTextColor: theme.blue5,
                    selectedDayBackgroundColor: theme.blue1,
                    selectedDayTextColor: theme.white,
                    arrowColor: theme.blue1,
                    calendarBackground: "transparent",
                    textDayStyle: { color: theme.blue1 },
                    textDisabledColor: theme.gray2,
                }}
                onDayPress={handleDayPress}
                markedDates={buildMarkedDates(day?.dateString)}
            />

            {data.tasksData.length > 0 ? <FlatList
                data={data.tasksData}
                keyExtractor={(item) => item._id}
                ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
                renderItem={({ item }) => (
                    <Task
                        _id={item._id}
                        name={item.name}
                        handleOpenTask={() => handleTask(item._id)}
                        status={item.status}
                        priority={item.priority}
                        date={formatDate(item.date)}
                        color={data.categories.find((category) => category._id === item.category)?.color || theme.blue1}
                        category={data.categories.find((category) => category._id === item.category)?.category || "Categoria nao encontrada"}
                        hours={item.hours}
                        subTask={item.subTask}
                        userId={item.userId}
                    />
                )} /> : (
                <EmptyState text="tarefas" title="O que você quer fazer hoje?" />
            )}

        </View>
    )
}