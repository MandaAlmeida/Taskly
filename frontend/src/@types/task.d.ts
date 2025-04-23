export type CreateTaskProps = {
    name: string;
    category: string | undefined;
    subCategory: string | undefined;
    priority: string;
    date: string;
}

export type TaskProps = {
    _id: string;
    name: string;
    category: string;
    subCategory: string;
    priority: string;
    date: string;
    status: string;
    userId: string;
}