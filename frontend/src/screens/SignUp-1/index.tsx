import { Text, View, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { DateData, CalendarUtils } from "react-native-calendars";
import { ModalCalendar } from "@/components/modalCalendar";

import { InputForm } from "@/components/inputForm";
import { useRef, useState } from "react";

import { AccountProps } from "@/@types/account";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/button";

import { styles } from "./styles";
import { theme } from "@/styles/theme";
import { Feather } from "@expo/vector-icons";
import { useTask } from "@/hooks/useTask";
import { Progress } from "@/components/progress";
import { formatDate } from "@/utils/formatDate";

export function SignUp1() {
    const { error } = useTask();
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

    const handleDayPress = (day: { dateString: string }) => {
        setShowCalendar(false);
        setValue("birth", day.dateString);
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

                    <ModalCalendar
                        isVisible={showCalendar}
                        handleOnVisible={() => setShowCalendar(false)}
                        onDateSelected={(dateData) => {
                            setSelectedDate(dateData);
                            setValue("birth", dateData.dateString);
                        }}
                        selectedDate={selectedDate}
                    />

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
