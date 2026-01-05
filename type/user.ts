export type User = {
    id: string,
    email: string,
    name: string,
    avatar: {
        id: string,
        src: string,
        width: number,
        height: number
    },
    role: string,
    confirmed: boolean
}