import { isAuthorized } from '@/action/server'
import Login from '@/components/Login'
import { redirect } from 'next/navigation'

export default async () =>
    isAuthorized()
        .then(
            () => { redirect('/dashboard') },
            () => <Login />
        )