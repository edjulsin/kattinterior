import { type NextRequest } from 'next/server'
import { redirect } from 'next/navigation'
import { verifyEmailToken } from '@/action/server'

const split = (v: string | null) => v ? Promise.resolve(v) : Promise.reject()

export const GET = async (request: NextRequest) =>
    split(
        new URL(request.url).searchParams.get('token_hash') + ''
    ).then(
        token => verifyEmailToken(token).then(
            () => '/dashboard',
            () => '/'
        ),
        () => '/'
    ).then(v => { redirect(v) })