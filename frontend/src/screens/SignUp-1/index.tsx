import { Text, View, TextInput, TouchableOpacity, ScrollView, Modal } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { DateData, CalendarUtils, Calendar } from "react-native-calendars";

import { InputForm } from "@/components/inputForm";
import { useRef, useState } from "react";

import { AccountProps } from "@/@types/account";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/button";

import { styles } from "./styles";
import { theme } from "@/styles/theme";
import { Feather } from "@expo/vector-icons";
import { Progress } from "@/components/progress";
import { formatDate } from "@/utils/formatDate";

export function SignUp1() {
    const { control, formState: { errors }, watch, handleSubmit, setValue } = useFormContext<AccountProps>();

    const nameRef = useRef<TextInput>(null);
    const emailRef = useRef<TextInput>(null);

    const { navigate } = useNavigation();

    const userName = watch("userName");
    const name = watch("name");
    const birth = watch("birth");
    const isDisabled = !name || !userName || !birth;

    const [showCalendar, setShowCalendar] = useState(false);
    const [selectedDate, setSelectedDate] = useState<DateData>({
        dateString: birth || CalendarUtils.getCalendarDateString(new Date()),
        day: 0,
        month: 0,
        year: 0,
        timestamp: 0,
    });


    const handleLogin = () => navigate("signIn");
    const handleNextPage = () => navigate("signUp2");
    const handleNextWelcome = () => navigate("welcome");

    const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i); // últimos 100 anos
    const months = [
        { label: "Janeiro", value: 1 },
        { label: "Fevereiro", value: 2 },
        { label: "Março", value: 3 },
        { label: "Abril", value: 4 },
        { label: "Maio", value: 5 },
        { label: "Junho", value: 6 },
        { label: "Julho", value: 7 },
        { label: "Agosto", value: 8 },
        { label: "Setembro", value: 9 },
        { label: "Outubro", value: 10 },
        { label: "Novembro", value: 11 },
        { label: "Dezembro", value: 12 },
    ];

    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

    const handleSelectDate = (day: DateData) => {
        setSelectedDate(day);
        setValue("birth", day.dateString);
        setShowCalendar(false);
    };


    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.previous} onPress={handleNextWelcome}>
                <Feather name="chevron-left" size={30} color={theme.gray4} />
            </TouchableOpacity>

            <ScrollView contentContainerStyle={styles.form}>
                <Text style={styles.title}>Registro</Text>

                <InputForm
                    text="Nome de usuário"
                    formProps={{
                        name: "userName",
                        control,
                        rules: { required: "Nome de usuário é obrigatório" },
                    }}
                    inputProps={{
                        placeholder: "Nome de usuário",
                        placeholderTextColor: theme.gray2,
                        onSubmitEditing: () => emailRef.current?.focus(),
                        returnKeyType: "next",
                    }}
                    error={errors.userName?.message}
                />

                <InputForm
                    text="Nome"
                    formProps={{
                        name: "name",
                        control,
                        rules: { required: "Nome é obrigatório" },
                    }}
                    inputProps={{
                        placeholder: "Nome",
                        placeholderTextColor: theme.gray2,
                        onSubmitEditing: () => nameRef.current?.focus(),
                        returnKeyType: "next",
                    }}
                    error={errors.name?.message}
                />

                <View style={styles.containerInput}>
                    <Text style={styles.textInput}>Data de nascimento</Text>
                    <TouchableOpacity
                        onPress={() => setShowCalendar(true)}
                        style={styles.input}
                    >
                        <Text style={[styles.textInput, { color: birth ? theme.gray4 : theme.gray2 }]}>
                            {birth ? formatDate(birth) : "Selecionar data"}
                        </Text>
                    </TouchableOpacity>

                    {errors.birth && <Text style={{ color: "red" }}>{errors.birth.message}</Text>}

                    <Modal
                        visible={showCalendar}
                        transparent
                        animationType="slide"
                        onRequestClose={() => setShowCalendar(false)}
                    >
                        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{ backgroundColor: '#fff', borderRadius: 10, padding: 20, width: '90%' }}>
                                {/* Header com seleção de mês/ano */}
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                                    <TouchableOpacity onPress={() => setShowCalendar(false)}>
                                        <Feather name="x" size={24} color="black" />
                                    </TouchableOpacity>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <TouchableOpacity onPress={() => setCurrentYear(prev => prev - 1)}>
                                            <Feather name="chevron-left" size={24} color="black" />
                                        </TouchableOpacity>
                                        <Text style={{ marginHorizontal: 10 }}>{currentYear}</Text>
                                        <TouchableOpacity onPress={() => setCurrentYear(prev => prev + 1)}>
                                            <Feather name="chevron-right" size={24} color="black" />
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                {/* Seleção de mês */}
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10 }}>
                                    {months.map(month => (
                                        <TouchableOpacity
                                            key={month.value}
                                            style={{
                                                padding: 8,
                                                marginHorizontal: 5,
                                                borderRadius: 5,
                                                backgroundColor: currentMonth === month.value ? theme.blue1 : theme.gray1,
                                            }}
                                            onPress={() => setCurrentMonth(month.value)}
                                        >
                                            <Text style={{ color: currentMonth === month.value ? '#fff' : '#000' }}>{month.label}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>

                                {/* Calendário */}
                                <Calendar
                                    current={`${currentYear}-${String(currentMonth).padStart(2, '0')}-01`}
                                    onDayPress={handleSelectDate}
                                    markedDates={{
                                        [selectedDate.dateString]: { selected: true, selectedColor: theme.blue1 },
                                    }}
                                    theme={{
                                        todayTextColor: theme.blue1,
                                        arrowColor: theme.blue1,
                                    }}
                                    hideExtraDays
                                />

                                {/* Botão de fechar */}
                                <Button text="Fechar" onPress={() => setShowCalendar(false)} style={{ marginTop: 10 }} />
                            </View>
                        </View>
                    </Modal>


                </View>

                <Button
                    text="CONTINUAR"
                    onPress={handleSubmit(handleNextPage)}
                    style={[
                        styles.button,
                        { opacity: isDisabled ? 0.5 : 1, width: 150, alignSelf: "flex-end" },
                    ]}
                    disabled={isDisabled}
                />

                <Progress count={1} />
            </ScrollView>

            <View style={styles.register}>
                <Text style={styles.text}>Já tem uma conta?</Text>
                <TouchableOpacity onPress={handleLogin}>
                    <Text style={styles.link}>Faça login.</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
