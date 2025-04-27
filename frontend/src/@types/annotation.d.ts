export type attachmentProps = {
    title: string;
    url: string
}

type members = {
    userId: string;
    accessType: string
}

type content = {
    type: string,
    value: string | attachmentProps
}

export type CreateAnnotationProps = {
    title: string;
    content: content[];
    category: string;
    attachment?: attachmentProps[];
    members?: members[];
    groupId?: string[];
}

export type AnnotationProps = {
    _id: string;
    title: string;
    content: content[];
    category: string;
    createdAt: string;
    updatedAt: string;
    members?: members[];
    groupId?: string[];
    createdUserId: string;
}