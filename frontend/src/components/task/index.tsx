import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from "./styles"
import { theme } from '@/styles/theme';
import { Check, Flag } from 'lucide-react-native';

type ParticipantProps = {
    name: string;
    date: string;
    handleTaskConclue: () => void;
    handleOpenTask: () => void;
    status: string;
    priority: string;
    category: string;
    color: string
}

export function Task({ name, status, priority, category, date, color, handleTaskConclue, handleOpenTask }: ParticipantProps) {

    return (
        <TouchableOpacity style={[styles.container, {
            borderColor: color,
            backgroundColor: `${color}20`
        }]} onPress={handleOpenTask}>

            {status === "COMPLETED" ? (
                <View style={styles.containerCheck}>
                    <TouchableOpacity
                        style={[styles.conclude, {
                            backgroundColor: color
                        }]}
                        onPress={handleTaskConclue}
                    >
                        <Check size={12} color="#F2F2F2" /></TouchableOpacity>
                    <View>
                        <Text style={styles.nameCheck}>{name}</Text>
                        <Text style={styles.textCheck}>{date}</Text>
                    </View>
                </View>
            ) : (
                <View style={styles.containerCheck}>
                    <TouchableOpacity
                        style={[styles.circle, {
                            borderColor: color
                        }]}
                        onPress={handleTaskConclue}
                    />
                    <View>
                        <Text style={styles.name}>{name}</Text>
                        <Text style={styles.text}>{date}</Text>
                    </View>
                </View>
            )
            }


            <View style={styles.containerItems}>
                <View style={[styles.containerCategory, { backgroundColor: color }]}>
                    <Text style={styles.category}>{category}</Text>
                </View>
                <View style={[styles.containerPriority, { borderColor: color }]}>
                    <Flag size={14} color={theme.gray3} />
                    <Text style={[styles.category, { color: theme.gray3 }]}>{priority}</Text>
                </View>
            </View>

        </TouchableOpacity >
    )
}
