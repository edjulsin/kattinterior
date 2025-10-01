import { type NextRequest } from 'next/server'
import { redirect } from 'next/navigation'
import { verifyEmailToken } from '@/action/server'
import sanitize from 'sanitize-html'
import { isURL } from 'validator'

const split = (v: string) => {
    const sanitized = sanitize(
        (v + '').trim()
    )
    if(isURL(sanitized)) {
        const token = (new URL(sanitized).searchParams.get('token') ?? '') + ''
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