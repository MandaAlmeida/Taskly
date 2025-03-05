import { NavigationContainer } from "@react-navigation/native";


import { AppRoutes } from "./app.routes";
import { AuthRoutes } from "./auth.routes";
import { useTask } from "@/hooks/useTask";


export function Routes() {
    const { token } = useTask();

    return (
        <NavigationContainer >
            {
                token !== "" ? <AppRoutes /> : <AuthRoutes />
            }
        </NavigationContainer >
    )
}