export type attachmentProps = {
    type: string;
    title: string;
    url: string
}

type members = {
    userId: string;
    accessType: string
}

export type contentProps = {
    type: 'text' | 'image',
    value: string | attachmentProps
}

export type CreateAnnotationProps = {
    title: string;
    content: content[];
    category: string;
    attachments?: attachmentProps[];
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
    attachments?: attachmentProps[];
}