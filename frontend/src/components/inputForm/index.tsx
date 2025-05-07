import { TextInput, TextInputProps, View, Text } from "react-native";
import { styles } from "./styles";
import { Controller, UseControllerProps } from "react-hook-form"
import { forwardRef } from "react";
import { theme } from '@/styles/theme';

type AccountProps = {
    userName: string;
    name: string;
    email: string;
    birth: string;
    password: string;
    passwordConfirmation: string;
}


type InputProps = {
    text: string;
    formProps: UseControllerProps<AccountProps>;
    inputProps: TextInputProps;
    error?: string
    rightIcon?: React.ReactNode;
}

const InputForm = forwardRef<TextInput, InputProps>(({ text, formProps, inputProps, error = "", rightIcon }, ref) => {
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
                {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
            </View>
        )}
            {...formProps}
        />
    )
})

export { InputForm };