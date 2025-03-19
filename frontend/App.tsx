import React from "react";
import { TaskContextProvider } from "@/context/taskContext";
import { Routes } from "@/routes";

import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from 'react-native-safe-area-context';

import { theme } from '@/styles/theme';


export default function App() {
  return (
    <TaskContextProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar style="dark" backgroundColor={theme.white} translucent />
        <Routes />
      </SafeAreaView>
    </TaskContextProvider>
  );
}
