import { useContext } from "react";

import { TaskContext } from "@/context/taskContext";

export function useTask() {
    const context = useContext(TaskContext)

    return context
}