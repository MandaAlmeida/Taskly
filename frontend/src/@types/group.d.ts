import { membersProps } from "./annotation"

export type GroupProps = {
    _id: string;
    name: string;
    description: string;
    createUserId: string;
    members?: membersProps[];
    icon: number;
    color: string;
}