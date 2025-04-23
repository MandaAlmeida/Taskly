export type attachmentProps = {
    title: string;
    url: string
}

type members = {
    userId: string;
    accessType: string
}

export type CreateAnnotationProps = {
    title: string;
    content: string;
    category: string;
    attachment?: attachmentProps[];
    members?: members[];
    groupId?: string[];
}

export type AnnotationProps = {
    _id: string;
    title: string;
    content: string;
    category: string;
    createdAt: string;
    updatedAt: string;
    attachment?: attachmentProps[];
    members?: members[];
    groupId?: string[];
    createdUserId: string;
}