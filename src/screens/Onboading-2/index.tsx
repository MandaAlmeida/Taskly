import ImageOnboading from "@/assets/Onboarding-2.png";
import { Onboading } from "@/components/Onboading";
import { useNavigation } from "@react-navigation/native";


export function Onboading2() {
    const { navigate } = useNavigation();

    function handleNextPage() {
        navigate("onboading3");
    }

    function handlePreviousPage() {
        navigate("onboading1");
    }


    return (
        <Onboading
            title="Crie uma rotina diária"
            text="No TaskLy, você pode criar sua rotina personalizada para se manter produtivo."
            image={ImageOnboading}
            count={2}
            next={handleNextPage}
            previous={handlePreviousPage}
            isActive
        />
    )
}