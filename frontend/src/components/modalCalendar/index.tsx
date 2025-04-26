import React from "react";
import { View } from "react-native";
import Modal from "react-native-modal";
import {
    Calendar as CalentarDate,
    CalendarUtils,
    DateData,
} from "react-native-calendars";
import { ChevronLeft, ChevronRight } from "lucide-react-native";

import { styles } from "./styles"; // ajuste conforme o caminho real no seu projeto
import { theme } from "@/styles/theme"; // ajuste conforme o caminho real no seu projeto

// Tipagem das props
type ModalCalendarProps = {
    isVisible: boolean;
    handleOnVisible: () => void;
    onDateSelected: (date: DateData) => void;
    selectedDate: DateData;
};

export function ModalCalendar({
    isVisible,
    handleOnVisible,
    onDateSelected,
    selectedDate,
}: ModalCalendarProps) {
    const INITIAL_DATE = CalendarUtils.getCalendarDateString(new Date());

    function handleDayPress(item: DateData) {
        onDateSelected(item);
        handleOnVisible();
    }

    return (
        <Modal isVisible={isVisible}>
            <View style={styles.modalContainer}>
                <CalentarDate
                    current={INITIAL_DATE}
                    style={styles.calendar}
                    renderArrow={(direction: "left" | "right") =>
                        direction === "left" ? (
                            <ChevronLeft size={24} color={theme.blue1} />
                        ) : (
                            <ChevronRight size={24} color={theme.blue1} />
                        )
                    }
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
                    markedDates={{
                        [selectedDate.dateString]: { selected: true },
                    }}
                />
            </View>
        </Modal>
    );
}
