import { type NextRequest } from 'next/server'
import { redirect } from 'next/navigation'
import { verifyEmailToken } from '@/action/server'
import { isURL } from 'validator'

const development = process.env.NODE_ENV === 'development'
const tld = development ? false : true

const split = (v: string) => {
    const trimmed = (v + '').trim()
    if(isURL(trimmed, { require_tld: tld })) {
        const token = (new URL(trimmed).searchParams.get('token') ?? '') + ''
        return token ? Promise.resolve(token) : Promise.reject()
    } else {
        return Promise.reject()
    }
}

export const GET = async (request: NextRequest) =>
    split(request.url).then(
        token => verifyEmailToken(token).then(
            () => '/dashboard',
            () => '/'
        ),
        () => '/'
    ).then(v => {
        redirect(v)
    })