import { type NextRequest } from 'next/server'
import { redirect } from 'next/navigation'
import { verifyToken } from '@/action/server'
import { isURL } from 'validator'
import { EmailOtpType } from '@supabase/supabase-js'
import { confirmUser } from '@/action/admin'

const tld = process.env.NODE_ENV === 'production'

type OTP = { token_hash: string, type: EmailOtpType }

const otp = (v: string): Promise<OTP> => {
    const trimmed = (v + '').trim()
    if(isURL(trimmed, { require_tld: tld })) {
        const keys = ['type', 'token_hash']
        const data = Object.fromEntries(new URL(trimmed).searchParams)
        if(keys.every(key => key in data && data[key])) {
            const result = Object.fromEntries(
                keys.map(key => {
                    return [key, data[key] ?? '']
                })
            ) as OTP
            return Promise.resolve(result)
        } else {
            return Promise.reject('Missing fields.')
        }

    } else {
        return Promise.reject('Not a valid URL.')
    }
}

export const GET = async (request: NextRequest) =>
    otp(request.url).then(otp =>
        verifyToken(otp).then(v =>
            Promise.all(
                [v.user?.id ?? ''].filter(v =>
                    v && ['signup', 'invite'].includes(otp.type)
                ).map(confirmUser)
            )
        )
    ).then(
        () => { redirect('/dashboard') },
        () => { redirect('/') }
    )