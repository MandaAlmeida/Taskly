import { View } from "react-native";
import { Calendar, CalendarUtils, DateData, LocaleConfig } from 'react-native-calendars';
import { useState } from "react";

import { Feather } from "@expo/vector-icons";

import { ptBR } from "@/utils/localeCalendarConfig";
import { FlatListTaks } from "@/components/sectionTasks";

import { styles } from "./styles";
import { theme } from "@/styles/theme";
import { Header } from "@/components/header";
import { useTask } from "@/hooks/useTask";


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
    const { fetchTask, selectedCategory } = useTask();
    const INITIAL_DATE = CalendarUtils.getCalendarDateString(new Date());

    function handleDayPress(item: DateData) {
        setDay(item);
        fetchTask(selectedCategory, item);
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
        </View>
    )
}