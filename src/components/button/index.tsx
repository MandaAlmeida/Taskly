
import { TouchableOpacity, Text, TouchableOpacityProps, StyleProp, ViewStyle } from 'react-native';
import { styles } from './styles';

type Props = TouchableOpacityProps & {
    text: string;
    style?: StyleProp<ViewStyle>;
}

export function Button({ text, style, ...rest }: Props) {
    return (
        <TouchableOpacity style={[styles.button, style]} {...rest}>
            <Text style={styles.text}>{text}</Text>
        </TouchableOpacity>
    )
}