import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import Modal from 'react-native-modal';
import { Calendar as CalendarDate, DateData, LocaleConfig } from 'react-native-calendars';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { ptBR } from '@/utils/localeCalendarConfig';
import { theme } from '@/styles/theme';
import { styles } from './styles';
import { useTask } from '@/hooks/useTask';
import { ButtonModal } from '../buttonModal';


LocaleConfig.locales['pt-br'] = ptBR;
LocaleConfig.defaultLocale = 'pt-br';

const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export function ModalCalendar() {
    const { fetchTask, uiState, setUiState, modalState, setModalState, handleUpdateTask } = useTask();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [editableYear, setEditableYear] = useState(currentDate.getFullYear().toString());

    useEffect(() => {
        if (modalState.name === 'isSelectDateOpen' && modalState.data?.date) {
            const parsed = new Date(modalState.data.date); // ex: 2025-05-20T00:00:00.000Z
            const dateData = {
                dateString: parsed.toISOString().split('T')[0],
                day: parsed.getUTCDate(),
                month: parsed.getUTCMonth() + 1,
                year: parsed.getUTCFullYear(),
                timestamp: parsed.getTime()
            };

            setUiState(prev => ({ ...prev, date: dateData }));
            setCurrentDate(parsed);
            setEditableYear(parsed.getFullYear().toString());
        }
    }, [modalState.name]);

    // Altera mês ao clicar nas setas
    function handleMonthChange(direction: 'prev' | 'next') {
        const newDate = new Date(currentDate);
        newDate.setMonth(direction === 'prev' ? currentDate.getMonth() - 1 : currentDate.getMonth() + 1);
        setCurrentDate(newDate);
        setEditableYear(newDate.getFullYear().toString());
    }

    // Altera ano manualmente via input
    function handleYearChange(text: string) {
        setEditableYear(text);
        const newDate = new Date(currentDate);
        const numericYear = parseInt(text, 10);
        if (!isNaN(numericYear)) {
            newDate.setFullYear(numericYear);
            setCurrentDate(newDate);
        }
    }

    // Seleciona o dia no calendário
    function handleDayPress(day: DateData) {
        setUiState(prev => ({ ...prev, date: day }));
        fetchTask();
    }

    // Atualiza tarefa com nova data
    function UpdateDay() {
        if (modalState.data) {
            handleUpdateTask({ _id: modalState.data._id, date: uiState.date.dateString, task: modalState.data });
        }
        setModalState({ name: null })
    }

    return (
        <Modal isVisible={modalState.name === 'isSelectDateOpen'}>
            <View style={styles.modalContainer}>
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
                <CalendarDate
                    key={currentDate.toISOString()} // <- Força remontagem ao mudar mês/ano
                    current={currentDate.toISOString().split('T')[0]}
                    onDayPress={handleDayPress}
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
                        calendarBackground: 'transparent',
                        textDayStyle: { color: theme.blue1 },
                        textDisabledColor: theme.gray2,
                    }}
                    markedDates={{
                        [uiState.date.dateString]: { selected: true }
                    }}
                />


                {/* Botão de ação */}
                <ButtonModal
                    color={modalState.data?.color || theme.blue1}
                    CreateItem={UpdateDay}
                    handleOnVisible={() => setModalState({ name: null })}
                />
            </View>
        </Modal>
    );
}
