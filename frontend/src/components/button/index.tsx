
import { TouchableOpacity, Text, TouchableOpacityProps, StyleProp, ViewStyle } from 'react-native';
import { styles } from './styles';

type Props = TouchableOpacityProps & {
    text: string;
    style?: StyleProp<ViewStyle>;
    styleText?: StyleProp<ViewStyle>;

}

export function Button({ text, style, styleText, ...rest }: Props) {
    return (
        <TouchableOpacity style={[styles.button, style]} {...rest}>
            <Text style={[styles.text, styleText]}>{text}</Text>
        </TouchableOpacity>
    )
}