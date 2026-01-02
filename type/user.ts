export type User = {
    id: string,
    email: string,
    name: string,
    avatar: {
        src: string,
        width: number,
        height: number
    },
    role: string,
    confirmed: boolean
}