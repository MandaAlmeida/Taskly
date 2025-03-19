import { View } from "react-native";
import { styles } from "./styles";
import { theme } from '@/styles/theme';

type Props = {
    count: number
}

export function Progress({ count }: Props) {
    return (
        <View style={styles.container}>
            <View style={[styles.icon, { backgroundColor: count === 1 ? theme.gray4 : theme.lightGray }]} />
            <View style={[styles.icon, { backgroundColor: count === 2 ? theme.gray4 : theme.lightGray }]} />
            <View style={[styles.icon, { backgroundColor: count === 3 ? theme.gray4 : theme.lightGray }]} />

        </View>
    )
}