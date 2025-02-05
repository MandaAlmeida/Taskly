import React from "react";
import { TaskContextProvider } from "@/context/taskContext";
import { Routes } from "@/routes";



export default function App() {
  return (
    <TaskContextProvider>
      <Routes />
    </TaskContextProvider>
  );
}
