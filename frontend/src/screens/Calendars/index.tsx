import { FlatList, View } from "react-native";
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


LocaleConfig.locales["pt-br"] = ptBR
LocaleConfig.defaultLocale = "pt-br"

export function Calendars() {
    const { fetchTaskByDate, fetchTaskById, data } = useTask();
    const today = new Date();
    const INITIAL_DATE = CalendarUtils.getCalendarDateString(today);

    const [day, setDay] = useState<DateData>({
        year: today.getFullYear(),
        month: today.getMonth() + 1,
        day: today.getDate(),
        timestamp: today.getTime(),
        dateString: INITIAL_DATE,
    });


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
            <Calendar
                current={INITIAL_DATE}
                style={styles.calendar}
                renderArrow={(direction: "left" | "right") => (
                    <Feather size={24} color={theme.blue1} name={`chevron-${direction}`} />)}
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
                        handleOpenTask={() => fetchTaskById(item._id)}
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