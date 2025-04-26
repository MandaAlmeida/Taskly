export type CreateSubTaskProps = {
    _id?: string;
    task: string;
    status: "COMPLETED" | "PENDING"
}

export type CreateTaskProps = {
    name: string;
    category: string | undefined;
    subCategory: string | undefined;
    subTask?: CreateSubTaskProps[]
    priority: string;
    date: string;
}

export type TaskProps = {
    _id: string;
    name: string;
    category: string;
    subCategory: string;
    subTask?: CreateSubTaskProps[]
    priority: string;
    date: string;
    status: string;
    userId: string;
}