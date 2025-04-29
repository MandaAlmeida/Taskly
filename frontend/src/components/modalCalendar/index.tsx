import { theme } from '@/styles/theme';
import { Calendar as CalentarDate, CalendarUtils, DateData, LocaleConfig } from 'react-native-calendars';
import { styles } from './styles';
import { ptBR } from '@/utils/localeCalendarConfig';
import { useTask } from '@/hooks/useTask';
import { View, Text, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { TaskProps } from '@/@types/task';
import { ModalProps } from '../modalSubTask';
import { ButtonModal } from '../buttonModal';

LocaleConfig.locales["pt-br"] = ptBR
LocaleConfig.defaultLocale = "pt-br"



export function ModalCalendar({ isVisible, handleOnVisible, task }: ModalProps) {
    const { fetchTask, setDate, date, handleUpdateTask } = useTask();
    const INITIAL_DATE = CalendarUtils.getCalendarDateString(new Date());

    function handleDayPress(item: DateData) {
        setDate(item);
        fetchTask();
    }

    function UpdateDay() {
        if (task) {
            handleUpdateTask({ _id: task._id, date: date.dateString, task: task })
        }
        handleOnVisible();
    }

    return (
        <Modal isVisible={isVisible}>
            <View style={styles.modalContainer}>
                <CalentarDate
                    current={INITIAL_DATE}
                    style={styles.calendar}
                    renderArrow={(direction: "left" | "right") => (
                        direction === "left" ?
                            <ChevronLeft size={24} color={theme.blue1} /> : <ChevronRight size={24} color={theme.blue1} />)}
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

                <ButtonModal color={task?.color || theme.blue1} CreateItem={() => UpdateDay()} handleOnVisible={() => handleOnVisible()} />
            </View>
        </Modal >
    );
}