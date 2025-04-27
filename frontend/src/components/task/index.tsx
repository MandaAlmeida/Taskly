import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from "./styles"
import { theme } from '@/styles/theme';
import { Check, Flag } from 'lucide-react-native';
import { TaskProps } from '@/@types/task';

type taskType = TaskProps & {
    handleOpenTask: () => void;
    color: string
}

export function Task({ name, status, priority, subCategory, date, color, handleOpenTask }: taskType) {

    return (
        <TouchableOpacity style={[styles.container, {
            borderColor: color,
            backgroundColor: `${color}20`
        }]} onPress={handleOpenTask}>

            {status === "COMPLETED" ? (
                <View style={styles.containerCheck}>
                    <View style={[styles.conclude, {
                        backgroundColor: color
                    }]}>
                        <Check size={12} color="#F2F2F2" /></View>
                    <View>
                        <Text style={styles.nameCheck}>{name}</Text>
                        <Text style={styles.textCheck}>{date}</Text>
                    </View>
                </View>
            ) : (
                <View style={styles.containerCheck}>
                    <View style={[styles.circle, {
                        borderColor: color
                    }]} />
                    <View>
                        <Text style={styles.name}>{name}</Text>
                        <Text style={styles.text}>{date}</Text>
                    </View>
                </View>
            )
            }


            <View style={styles.containerItems}>
                <View style={[styles.containerCategory, { backgroundColor: color }]}>
                    <Text style={styles.category}>{subCategory}</Text>
                </View>
                <View style={[styles.containerPriority, { borderColor: color }]}>
                    <Flag size={14} color={theme.gray3} />
                    <Text style={[styles.category, { color: theme.gray3 }]}>{priority}</Text>
                </View>
            </View>

        </TouchableOpacity >
    )
}
