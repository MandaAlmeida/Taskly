import ImageOnboading from "@/assets/Onboarding-1.png";
import { Onboading } from "@/components/Onboading";
import { useNavigation } from "@react-navigation/native";


export function Onboading1() {
    const { navigate } = useNavigation();

    function handleNextOnboading() {
        navigate("onboading2");
    }


    return (
        <Onboading
            title="Gerencie suas tarefas"
            text="Você pode gerenciar facilmente todas as suas tarefas diárias no TaskLy de graça."
            image={ImageOnboading}
            count={1}
            next={handleNextOnboading}
        />
    )
}