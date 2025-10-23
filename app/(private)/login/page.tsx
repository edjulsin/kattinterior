import { isAuthorized } from '@/action/server'
import Login from '@/components/Login'
import { redirect } from 'next/navigation'

import pageSchema from '@/schemas/pageSchema'
import { Metadata } from 'next'
import Schema from '@/components/Schema'
import pageMeta from '@/meta/page'

const name = process.env.NEXT_PUBLIC_SITE_NAME
const meta = {
    title: 'Login',
    description: `Login into ${name} dashboard.`,
    path: '/login'
}

export const metadata: Metadata = pageMeta(meta)

const LoginPage = async () =>
    isAuthorized().then(
        () => { redirect('/dashboard') },
        () =>
            <Schema value={pageSchema(meta)}>
                <Login />
            </Schema>
    )

export default LoginPage