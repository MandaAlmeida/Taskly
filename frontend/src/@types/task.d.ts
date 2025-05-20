export type CreateSubTaskProps = {
    _id?: string;
    task: string;
    status: string
}

export type CreateTaskProps = {
    name: string;
    category: string | undefined;
    subCategory: string | undefined;
    subTask?: CreateSubTaskProps[]
    priority: string;
    date: string;
    hours?: string;
}

export type TaskProps = {
    _id: string;
    name: string;
    category: string;
    subCategory?: string;
    subTask?: CreateSubTaskProps[]
    priority: string;
    date: string;
    hours?: string;
    status: string;
    userId: string;
}