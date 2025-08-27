import { isAuthorized } from '@/action/server'
import Login from '@/components/Login'
import { redirect } from 'next/navigation'

import pageSchema from '@/schemas/pageSchema'
import { Metadata } from 'next'
import Schema from '@/components/Schema'

export const metadata: Metadata = {
    title: 'Login',
    description: `Login into ${process.env.NEXT_PUBLIC_SITE_NAME} dashboard.`,
    alternates: {
        canonical: '/login'
    }
}

const LoginPage = async () =>
    isAuthorized().then(
        () => { redirect('/dashboard') },
        () =>
            <Schema
                value={
                    pageSchema({
                        path: metadata.alternates?.canonical as string,
                        description: metadata.description as string
                    })
                }
            >
                <Login />
            </Schema>
    )

export default LoginPage