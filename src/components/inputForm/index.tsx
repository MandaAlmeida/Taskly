import { TextInput, TextInputProps, View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import { styles } from "./styles";
import { Controller, UseControllerProps } from "react-hook-form"
import { forwardRef } from "react";
import clsx from "clsx";
import { theme } from '@/styles/theme';
import { AccountProps } from "@/@types/account";

type InputProps = {
    text: string;
    formProps: UseControllerProps<AccountProps>;
    inputProps: TextInputProps;
    error?: string
}

const InputForm = forwardRef<TextInput, InputProps>(({ text, formProps, inputProps, error = "" }, ref) => {
    return (
        <Controller render={({ field }) => (
            <View style={styles.container}>
                <View style={styles.containerInput}>
                    <Text style={styles.label}>{text}</Text>
                    <TextInput
                        ref={ref}
                        value={field.value}
                        onChangeText={field.onChange}
                        style={[styles.input, {
                            borderColor: error.length > 0 ? theme.red : error.length === 0 && field.value ?
                                theme.blue1 :
                                theme.gray2
                        }]}
                        {...inputProps}
                    />
                </View>
                {error.length > 0 ? <Text style={styles.error}>{error}</Text> : ""}

            </View>
        )}
            {...formProps}
        />
    )
})

export { InputForm };