import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Feather } from '@expo/vector-icons';
import { PageTasks } from "@/screens/PageTasks";
import { AddTask } from "@/screens/AddTask";
import { AddCategory } from "@/screens/AddCategory";
import { Calendars } from "@/screens/Calendars";
import { theme } from '@/styles/theme';
import { Home } from "@/screens/Home";

type AppRoutes = {
    home: undefined;
    tasks: undefined;
    addTask: undefined;
    addCategory: undefined;
    calendar: undefined;
};


const Tab = createBottomTabNavigator<AppRoutes>();
const Stack = createNativeStackNavigator<AppRoutes>();

function StackNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="tasks" component={PageTasks} />
            <Stack.Screen name="addTask" component={AddTask} />
            <Stack.Screen name="addCategory" component={AddCategory} />
        </Stack.Navigator>
    );
}

export function AppRoutes() {
    return (
        <>
            <Tab.Navigator
                screenOptions={{
                    headerShown: false,
                    tabBarShowLabel: false,
                    tabBarHideOnKeyboard: true,
                    animation: "fade",
                    tabBarStyle: {
                        backgroundColor: theme.blue1,
                        borderTopWidth: 0,
                        paddingBottom: 10,
                        paddingTop: 5,
                        height: 60,
                        flexDirection: "row",
                        justifyContent: "space-around",
                    },
                }}
            >
                <Tab.Screen
                    name="home"
                    component={Home}
                    options={{
                        tabBarIcon: () => <Feather name="home" size={26} color={theme.white} />,
                    }}
                />
                <Tab.Screen
                    name="tasks"
                    component={StackNavigator}
                    options={{
                        tabBarIcon: () => <Feather name="list" size={26} color={theme.white} />,
                    }}
                />
                <Tab.Screen
                    name="calendar"
                    component={Calendars}
                    options={{
                        tabBarIcon: () => <Feather name="calendar" size={26} color={theme.white} />,
                    }}
                />
            </Tab.Navigator>
        </>
    );
}
