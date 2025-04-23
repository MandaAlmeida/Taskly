export type CreateSubCategoryProps = {
    subCategory: string;
    category: string;
    icon: number;
    color: string;
}

export type SubCategoryProps = {
    _id: string;
    subCategory: string;
    category: string;
    icon: number;
    color: string;
    userId: string;
}