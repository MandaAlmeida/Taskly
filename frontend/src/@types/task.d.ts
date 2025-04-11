import { DateData } from "react-native-calendars";
import { Status } from "./enum/status.enum";

export type TaskProps = {
    _id: string;
    name: string;
    category: string;
    priority: string;
    date: string;
    status: string;
    userId?: string;
}