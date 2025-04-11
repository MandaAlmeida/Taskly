import { theme } from '@/styles/theme';
import { Calendar as CalentarDate, CalendarUtils, DateData, LocaleConfig } from 'react-native-calendars';
import { styles } from './styles';
import { useState } from 'react';
import { ptBR } from '@/utils/localeCalendarConfig';
import { useTask } from '@/hooks/useTask';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList } from '@/routes/app.routes';

LocaleConfig.locales["pt-br"] = ptBR
LocaleConfig.defaultLocale = "pt-br"

type Props = {
    isVisible: boolean,
    handleOnVisible: () => void
}

type NavigationProps = StackNavigationProp<StackParamList>;

export function CalendarModal({ isVisible, handleOnVisible }: Props) {
    const { fetchTask, selectedCategory, setDate, date } = useTask();
    const navigation = useNavigation<NavigationProps>();
    const INITIAL_DATE = CalendarUtils.getCalendarDateString(new Date());
    function handleDayPress(item: DateData) {
        setDate(item);
        fetchTask(selectedCategory, item);
        console.log(item)
    }

    function handleGoBack() {
        navigation.navigate('tabs', { screen: 'addTask' });
    };

    return (
        <Modal isVisible={isVisible}>
            <View style={styles.modalContainer}>
                <CalentarDate
                    current={INITIAL_DATE}
                    style={styles.calendar}
                    // renderArrow={(direction: "left" | "right") => (
                    //     <Chevron-${direction} size={24} color={theme.blue1} name={`chevron-${direction}`} />)}
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
                    markedDates={date && {
                        [date.dateString]: { selected: true }
                    }}
                />

                <View style={styles.buttonsContainer}>
                    <TouchableOpacity onPress={() => handleOnVisible()}>
                        <Text style={styles.cancelText}>Cancelar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => handleOnVisible()} style={styles.confirmButton}>
                        <Text style={styles.confirmText}>Salvar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal >
    );
}
