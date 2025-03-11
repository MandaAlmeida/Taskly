import { View, Text, TouchableOpacity, Image, ImageSourcePropType } from "react-native";
import { styles } from "./styles";
import { Progress } from "@/components/progress";
import { useNavigation } from "@react-navigation/native";
import { Feather } from '@expo/vector-icons';
import { theme } from "@/styles/theme";

type Props = {
    title: string,
    text: string,
    image: ImageSourcePropType | undefined,
    count: number,
    isActive?: boolean,
    next: () => void,
    previous?: () => void
}

export function Onboading({ title, text, image, count, isActive = false, next, previous }: Props) {
    const { navigate } = useNavigation();

    function handleWelcome() {
        navigate("signIn");
    }


    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={handleWelcome} style={styles.skip}>
                <Text>Pular</Text>
                <Feather name="chevron-right" size={18} color={theme.gray4} />
            </TouchableOpacity>
            <Image source={image} style={styles.image} />
            <Progress count={count} />
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.text}>{text}</Text>
            <View style={[styles.containerButton, { justifyContent: isActive ? "space-between" : "flex-end" }]}>
                {isActive && <TouchableOpacity onPress={previous}>
                    <Text style={styles.buttonPrevious}>
                        Anterior
                    </Text>
                </TouchableOpacity>}
                <TouchableOpacity style={styles.buttonNext}>
                    {count === 3 ? <Text style={styles.textButton} onPress={next}>
                        Vamos começar
                    </Text> : <Text style={styles.textButton} onPress={next}>
                        Proximo
                    </Text>}
                </TouchableOpacity>
            </View>
        </View>
    )
}