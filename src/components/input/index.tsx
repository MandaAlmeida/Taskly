import React, { useState } from "react";
import { TextInput, TextInputProps, View, Text } from "react-native";
import { Controller, UseControllerProps } from "react-hook-form";
import { forwardRef } from "react";
import { styles } from "./styles";
import { TaskProps } from "@/@types/task";

type Props = {
    formProps: UseControllerProps<TaskProps>;
    inputProps: TextInputProps;
    error?: string;
};

const Input = forwardRef<TextInput, Props>(({ formProps, inputProps, error = "" }, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <Controller
            render={({ field }) => (
                <View>
                    <TextInput
                        style={[styles.input, isFocused && styles.inputFocused]}
                        placeholderTextColor={"#808080"}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        ref={ref}
                        onChangeText={field.onChange}
                        {...inputProps}
                    />
                    {error.length > 0 ? <Text style={styles.error}>{error}</Text> : ""}
                </View>
            )}
            {...formProps}
        />
    );
});

export { Input };
