import { NavigationContainer } from "@react-navigation/native";

import { useTask } from "@/hooks/useTask";
import { AppRoutes } from "./app.routes";
import { AuthRoutes } from "./auth.routes";

import { Loading } from "@/components/loading";

export function Routes() {
    const { loading, token } = useTask();

    return (
        <NavigationContainer>
            {loading ? <Loading /> : token ? <AppRoutes /> : <AuthRoutes />}
        </NavigationContainer>
    );
}
