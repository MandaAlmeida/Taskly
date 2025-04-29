import { FlatList, View, Image, Text } from "react-native";
import { Calendar, CalendarUtils, DateData, LocaleConfig } from 'react-native-calendars';
import { useEffect, useState } from "react";

import { Feather } from "@expo/vector-icons";

import { ptBR } from "@/utils/localeCalendarConfig";
import ImageHome from "@/assets/Checklist-rafiki.png";


import { styles } from "./styles";
import { theme } from "@/styles/theme";
import { Header } from "@/components/header";
import { useTask } from "@/hooks/useTask";
import { Task } from "@/components/task";
import { EmptyState } from "@/components/emptyState";
import { formatDate } from "@/utils/formatDate";
import { TaskProps } from "@/@types/task";


LocaleConfig.locales["pt-br"] = ptBR
LocaleConfig.defaultLocale = "pt-br"

export function Calendars() {
    const { fetchTaskByDate, tasksData, subCategory, fetchTaskById, tasks } = useTask();
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
        if (tasksData.length === 0) {
            fetchTaskByDate(day.dateString);
        }
    }, [tasksData])


    const buildMarkedDates = (selectedDate?: string) => {
        const marked: Record<string, any> = {};

        tasks.forEach(task => {
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

            {tasksData.length > 0 ? <FlatList
                data={tasksData}
                keyExtractor={(item) => item._id}
                ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
                renderItem={({ item }) => (
                    <Task
                        _id={item._id}
                        userId={item.userId}
                        name={item.name}
                        status={item.status}
                        priority={item.priority}
                        subCategory={subCategory.find((subCategory) => subCategory._id === item.subCategory)?.subCategory || "Sem sub categoria"}
                        category={item.subCategory}
                        date={formatDate(item.date)}
                        handleOpenTask={() => fetchTaskById(item._id)}
                        color={subCategory.find((subCategory) => subCategory._id === item.subCategory)?.color || theme.blue1}
                    />
                )} /> : (
                <EmptyState text="tarefas" title="O que você quer fazer hoje?" />
            )}

        </View>
    )
}