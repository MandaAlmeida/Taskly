import { View, Image } from "react-native";
import { Calendar, CalendarUtils, DateData, LocaleConfig } from 'react-native-calendars';
import { styles } from "./styles";
import { useState } from "react";

import { Feather } from "@expo/vector-icons";

import { ptBR } from "@/utils/localeCalendarConfig";
import { FlatListTaks } from "@/components/flatListTasks";

LocaleConfig.locales["pt-br"] = ptBR
LocaleConfig.defaultLocale = "pt-br"

export function Calendars() {
    const [day, setDay] = useState<DateData>()
    const INITIAL_DATE = CalendarUtils.getCalendarDateString(new Date());
    return (
        <View style={styles.container}>
            <View style={{ width: "100%", alignItems: "center" }}>
                <Image source={require('../../assets/logo.png')} />
            </View>
            <Calendar
                current={INITIAL_DATE}
                style={styles.calendar}
                renderArrow={(direction: "left" | "right") => (
                    <Feather size={24} color="#F4F4F4" name={`chevron-${direction}`} />)}
                theme={{
                    textMonthFontSize: 18,
                    monthTextColor: "#F4F4F4",
                    todayTextColor: "#4EA8DE",
                    selectedDayBackgroundColor: "#4EA8DE",
                    selectedDayTextColor: "#F4F4F4",
                    arrowColor: "#F4F4F4",
                    calendarBackground: "transparent",
                    textDayStyle: { color: "#F4F4F4" },
                    textDisabledColor: "#7C7C8A",
                }}
                onDayPress={setDay}
                markedDates={day && {
                    [day.dateString]: { selected: true }
                }}
            />
            <FlatListTaks />
        </View>
    )
}