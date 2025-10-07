import { useState } from 'react';
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

interface SignUpModalCalendarProps {
    isVisible: boolean;
    handleOnVisible: () => void;
}

export function SignUpModalCalendar({ isVisible, handleOnVisible }: SignUpModalCalendarProps) {
    const { uiState, setUiState } = useTask();
    const [currentDate, setCurrentDate] = useState(new Date());

    // Altera mês ao clicar nas setas
    function handleMonthChange(direction: 'prev' | 'next') {
        const newDate = new Date(currentDate);
        newDate.setMonth(direction === 'prev' ? currentDate.getMonth() - 1 : currentDate.getMonth() + 1);
        setCurrentDate(newDate);
    }

    // Seleciona o dia no calendário
    function handleDayPress(day: DateData) {
        setUiState(prev => ({ ...prev, date: day }));
        handleOnVisible(); // Fecha o modal após selecionar a data
    }

    return (
        <Modal isVisible={isVisible} onBackdropPress={handleOnVisible}>
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
                        <Text style={{ fontSize: 18, color: theme.blue2 }}>
                            {currentDate.getFullYear()}
                        </Text>
                    </View>

                    <TouchableOpacity onPress={() => handleMonthChange('next')}>
                        <ChevronRight size={24} color={theme.blue1} />
                    </TouchableOpacity>
                </View>

                {/* Calendário principal */}
                <CalendarDate
                    key={currentDate.toISOString()}
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

                {/* Botão de fechar */}
                <TouchableOpacity 
                    style={[styles.button, { backgroundColor: theme.blue1 }]}
                    onPress={handleOnVisible}
                >
                    <Text style={[styles.buttonText, { color: theme.white }]}>Confirmar</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
}
