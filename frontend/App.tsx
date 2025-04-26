import React from "react";
import { TaskContextProvider } from "@/context/taskContext";
import { Routes } from "@/routes";

import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from 'react-native-safe-area-context';

import { theme } from '@/styles/theme';
import { FormProvider, useForm } from "react-hook-form";
import { AccountProps } from "@/@types/account";


export default function App() {
  const methods = useForm<AccountProps>();

  return (
    <TaskContextProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar style="dark" backgroundColor={theme.white} translucent />
        <FormProvider {...methods}>
          <Routes />
        </FormProvider>
      </SafeAreaView>
    </TaskContextProvider>
  );
}
