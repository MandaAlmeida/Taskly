import ImageOnboading from "@/assets/Onboarding-3.png";
import { Onboading } from "@/components/Onboading";
import { useNavigation } from "@react-navigation/native";


export function Onboading3() {
    const { navigate } = useNavigation();

    function handleNextPage() {
        navigate("welcome");
    }

    function handlePreviousPage() {
        navigate("onboading2");
    }


    return (
        <Onboading
            title="Organize suas tarefas"
            text="Você pode organizar suas tarefas diárias adicionando-as em categorias separadas."
            image={ImageOnboading}
            count={3}
            next={handleNextPage}
            previous={handlePreviousPage}
            isActive
        />
    )
}