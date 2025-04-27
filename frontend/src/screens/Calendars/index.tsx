import { FlatList, View, Image, Text } from "react-native";
import { Calendar, CalendarUtils, DateData, LocaleConfig } from 'react-native-calendars';
import { useState } from "react";

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


LocaleConfig.locales["pt-br"] = ptBR
LocaleConfig.defaultLocale = "pt-br"

export function Calendars() {
    const [day, setDay] = useState<DateData>({
        year: 0,
        month: 0,
        day: 0,
        timestamp: 0,
        dateString: "",
    })
    const { fetchTaskByDate, tasksData, handleUpdateTask, subCategory, fetchTaskById } = useTask();
    const INITIAL_DATE = CalendarUtils.getCalendarDateString(new Date());

    function handleDayPress(item: DateData) {
        setDay(item);
        fetchTaskByDate(item.dateString);
    }


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
                markedDates={day && {
                    [day.dateString]: { selected: true }
                }}
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