import React from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { FontAwesome, Octicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { theme } from '@/styles/theme';
import { Home } from "@/screens/Home";
import { PageTasks } from "@/screens/PageTasks";
import { AddTask } from "@/screens/AddTask";
import { AddCategory } from "@/screens/AddCategory";
import { Calendars } from "@/screens/Calendars";
import { Profile } from "@/screens/Profile";
import { TaskProps } from "@/@types/task";
import { useNavigation } from "@react-navigation/native";
import { styles } from "./styles";

type AppRoutes = {
    home: undefined;
    tasks: undefined;
    addTask: { dataTask?: TaskProps };
    addCategory: undefined;
    calendar: undefined;
    profile: undefined;
};

const Tab = createBottomTabNavigator<AppRoutes>();
const Stack = createNativeStackNavigator<AppRoutes>();

function StackNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="tasks" component={PageTasks} />
            <Stack.Screen name="addCategory" component={AddCategory} />
        </Stack.Navigator>
    );
}

export function AppRoutes() {
    const navigation = useNavigation();

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarHideOnKeyboard: true,
                animation: "fade",
                tabBarStyle: styles.tabBar,
                tabBarShowLabel: false,
            }}
        >
            <Tab.Screen
                name="home"
                component={Home}
                options={{
                    tabBarIcon: ({ focused }) => <View style={[styles.button, { backgroundColor: focused ? "rgba(244, 244, 244, 0.2)" : "transparent" }]}><FontAwesome name="home" size={22} color={theme.white} />
                        <Text style={styles.text}>Inicio</Text>
                    </View>,
                }}
            />
            <Tab.Screen
                name="tasks"
                component={StackNavigator}
                options={{
                    tabBarIcon: ({ focused }) => <View style={[styles.button, { backgroundColor: focused ? "rgba(244, 244, 244, 0.2)" : "transparent" }]}><FontAwesome name="list" size={22} color={theme.white} />
                        <Text style={styles.text}>Tarefa</Text>
                    </View>,
                }}
            />
            <Tab.Screen
                name="addTask"
                component={AddTask}
                options={{
                    tabBarButton: () => (
                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={() => navigation.navigate("addTask", {})}
                        >
                            <Octicons name="plus" size={22} color="white" />
                        </TouchableOpacity>
                    ),
                }}
            />
            <Tab.Screen
                name="calendar"
                component={Calendars}
                options={{
                    tabBarIcon: ({ focused }) => <View style={[styles.button, { backgroundColor: focused ? "rgba(244, 244, 244, 0.2)" : "transparent" }]}><FontAwesome name="calendar" size={22} color={theme.white} />
                        <Text style={styles.text}>Calendario</Text>
                    </View>,
                }}
            />
            <Tab.Screen
                name="profile"
                component={Profile}
                options={{
                    tabBarIcon: ({ focused }) => <View style={[styles.button, { backgroundColor: focused ? "rgba(244, 244, 244, 0.2)" : "transparent" }]}><FontAwesome name="user-o" size={22} color={theme.white} />
                        <Text style={styles.text}>Perfil</Text>
                    </View>,
                }}
            />
        </Tab.Navigator>
    );
}
