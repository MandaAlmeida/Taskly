import { NavigationContainer } from "@react-navigation/native";


import { AppRoutes } from "./app.routes";
import { AuthRoutes } from "./auth.routes";
import { TaskContextProvider } from "@/context/taskContext";
import { useTask } from "@/hooks/useTask";


export function Routes() {
    const { user } = useTask();

    return (
        <NavigationContainer >
            {
                user !== "" ? <AppRoutes /> : <AuthRoutes />
            }
        </NavigationContainer >
    )
}