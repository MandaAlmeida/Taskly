export type CreateCategoryProps = {
    name: string;
    icon: number;
    color: string;
}

export type CategoryProps = {
    _id: string;
    category: string;
    icon: number;
    color: string;
    userId: string | undefined;
}