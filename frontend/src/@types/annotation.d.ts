export type attachmentProps = {
    type: string;
    title: string;
    url: string
}

export type membersProps = {
    userId: string;
    name: string;
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
    members?: membersProps[];
    groupId?: string[];
}

export type AnnotationProps = {
    _id: string;
    title: string;
    content: content[];
    category: string;
    createdAt: string;
    updatedAt: string;
    members?: membersProps[];
    groupId?: string[];
    createdUserId: string;
    attachments?: attachmentProps[];
}