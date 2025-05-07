type imageData = {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    buffer: string;
    size: number;
}

export type AccountProps = {
    userName: string;
    name: string;
    email: string;
    birth: string;
    password: string;
    passwordConfirmation: string;
}

export type AccountImageProps = {
    userName: string;
    name: string;
    email: string;
    birth: string;
    imageUser: imageData;
    password: string;
    passwordConfirmation: string;
}