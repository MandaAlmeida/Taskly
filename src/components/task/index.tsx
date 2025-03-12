import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from "./styles"
import Feather from '@expo/vector-icons/Feather';
import AntDesign from '@expo/vector-icons/AntDesign';
import { theme } from '@/styles/theme';

type ParticipantProps = {
    name: string;
    date: string;
    onRemove: () => void;
    handleTaskConclue?: () => void;
    handleUpdate: () => void;
    active: boolean;
    priority: string;
    category: string;
}

export function Task({ name, onRemove, handleTaskConclue, handleUpdate, active, priority, category, date }: ParticipantProps) {

    return (
        <View style={[styles.container, {
            borderColor: priority === "Alta"
                ? "#FF3B30"
                : priority === "Media"
                    ? "#ff9500"
                    : "#34C759",
            backgroundColor: priority === 'Alta'
                ? 'rgba(255, 59, 48, 0.2)' : priority === 'Media'
                    ? 'rgba(255, 149, 0, 0.2)' :
                    'rgba(52, 199, 89, 0.2)'
        }]}>

            {active ? (
                <View style={styles.containerCheck}>
                    <TouchableOpacity
                        onPress={handleTaskConclue}><AntDesign style={[styles.conclude, {
                            backgroundColor: priority === "Alta"
                                ? "#FF3B30"
                                : priority === "Media"
                                    ? "#ff9500"
                                    : "#34C759"
                        }]} name="check" size={12} color="#F2F2F2" /></TouchableOpacity>
                    <View>
                        <Text style={styles.nameCheck}>{name}</Text>
                        <Text style={styles.textCheck}>{date}</Text>
                    </View>
                </View>
            ) : (
                <View style={styles.containerCheck}>
                    <TouchableOpacity onPress={handleTaskConclue}>
                        <Text style={[styles.circle, {
                            borderColor: priority === "Alta"
                                ? "#FF3B30"
                                : priority === "Media"
                                    ? "#ff9500"
                                    : "#34C759"
                        }]}></Text>
                    </TouchableOpacity>
                    <View>
                        <Text style={styles.name}>{name}</Text>
                        <Text style={styles.text}>{date}</Text>
                    </View>
                </View>
            )
            }


            <View style={styles.containerItems}>
                <View style={styles.containerCategory}>
                    <Text style={styles.category}>{category}</Text>
                </View>
                <View style={styles.containerCategory}>
                    <Feather name="flag" size={14} color={theme.gray3} />
                    <Text style={[styles.category, { color: theme.gray3 }]}>1</Text>
                </View>
            </View>

        </View >
    )
}
