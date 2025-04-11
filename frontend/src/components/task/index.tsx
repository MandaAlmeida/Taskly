import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from "./styles"
import AntDesign from '@expo/vector-icons/AntDesign';
import { theme } from '@/styles/theme';
import { Flag } from 'lucide-react-native';
import { Status } from '@/@types/enum/status.enum';

type ParticipantProps = {
    name: string;
    date: string;
    handleTaskConclue: () => void;
    status: Status
    priority: string;
    category: string;
}

export function Task({ name, status, priority, category, date, handleTaskConclue }: ParticipantProps) {

    return (
        <View style={[styles.container, {
            borderColor: "#809CFF",
            backgroundColor: "rgba(128, 156, 255, 0.2)"
        }]}>

            {status === "COMPLETED" ? (
                <View style={styles.containerCheck}>
                    <TouchableOpacity
                        onPress={handleTaskConclue}
                    >
                        <AntDesign style={[styles.conclude, {
                            backgroundColor: "#809CFF"
                        }]} name="check" size={12} color="#F2F2F2" /></TouchableOpacity>
                    <View>
                        <Text style={styles.nameCheck}>{name}</Text>
                        <Text style={styles.textCheck}>{date}</Text>
                    </View>
                </View>
            ) : (
                <View style={styles.containerCheck}>
                    <TouchableOpacity
                        onPress={handleTaskConclue}
                    >
                        <Text style={[styles.circle, {
                            borderColor: "#809CFF"
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
                <View style={styles.containerPriority}>
                    <Flag size={14} color={theme.gray3} />
                    <Text style={[styles.category, { color: theme.gray3 }]}>{priority}</Text>
                </View>
            </View>

        </View >
    )
}
