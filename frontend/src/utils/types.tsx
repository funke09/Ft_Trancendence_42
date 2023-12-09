export type User = {
    id: number,
    username: string,
    password?: string,
    email?: string,
    avatar?: string,
    userStatus: string,
    createdAt?: string,

    url?: string,
    oAuth_code?: any,
    oAuth_exp?: any,
}