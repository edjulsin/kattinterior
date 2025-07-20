'use server'


import { Contact } from '@/email/Contact'
import { isValidEmail } from '@/utility/fn'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Resend } from 'resend'
import sanitizer from 'sanitize-html'

const sanitize = (string: string) => sanitizer(string, {
    allowedTags: [],
    allowedAttributes: {}
})

const client = async () => cookies().then(store =>
    createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return store.getAll()
                },
                setAll(value) {
                    try {
                        value.forEach(({ name, value, options }) =>
                            store.set(name, value, options)
                        )
                    } catch {
                        // The `setAll` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                }
            }
        }
    )
)

export const isAuthorized = async () => client().then(client =>
    client.auth.getUser().then(v =>
        (v.error === null && v.data.user !== null) ? Promise.resolve() : Promise.reject()
    )
)

const smtp = () => new Resend(process.env.RESEND_API_KEY!)

export const signIn = async (email: string) => {
    const formatted = email + ''
    if(isValidEmail(formatted)) {
        return client().then(
            client => client.auth.signInWithOtp({ email: formatted }).then(v =>
                v.error === null
                    ? Promise.resolve()
                    : Promise.reject()
            )
        )
    } else {
        return Promise.reject()
    }
}

export const signOut = async () => client().then(client =>
    client.auth.signOut()
)

export const sendEmail = async (form: FormData) => {
    const values = {
        name: (form.get('name') + '').trim(),
        email: (form.get('email') + '').trim(),
        message: (form.get('message') + '').trim()
    }

    const errors = Object.entries({
        name: values.name.length > 2 && values.name.length < 50 ? '' : 'Name must contain 2 to 50 characters',
        email: isValidEmail(values.email) ? '' : 'Invalid email address',
        message: values.message.length > 10 && values.message.length < 1000 ? '' : 'Message must contain 10 to 1000 characters'
    }).filter(([ _, v ]) => v)

    if(errors.length > 0) {
        return Promise.reject(
            errors.reduce((a, [ k, v ]) => ({ ...a, [ k ]: v }), {})
        )
    } else {
        const form = {
            name: sanitize(values.name),
            email: sanitize(values.email),
            message: sanitize(values.message)
        }
        return smtp().emails.send({
            from: process.env.EMAIL_SENDER!,
            to: process.env.EMAIL_RECEIVER!,
            subject: 'Contact from kattinterior.com',
            react: Contact(form)
        }).then(
            () => Promise.resolve(form),
            () => Promise.reject({ other: 'Something is wrong' })
        )
    }
}

export const getProject = async (id: string) => client().then(client =>
    client.from('projects').select('*').eq('id', id + '').then(v => {
        if(v.error === null) {
            return Promise.resolve(v.data ?? ([]))
        } else {
            return Promise.reject()
        }
    })
)

export const getProjects = async (limit: number) => client().then(client =>
    client.from('projects').select('*').order('created_at', { ascending: false }).limit(limit).then(v => {
        if(v.error === null) {
            return Promise.resolve(v.data ?? ([]))
        } else {
            return Promise.reject()
        }
    })
)

export const getPublishedProjects = async (start: number, end: number) =>
    client().then(client =>
        client
            .from('projects')
            .select('*')
            .eq('published', true)
            .order('created_at', { ascending: false })
            .range(start, end)
            .then(v => {
                if(v.error === null) {
                    return Promise.resolve(v.data ?? ([]))
                } else {
                    return Promise.reject()
                }
            })
    )


export const verifyEmailToken = async (token_hash: string): Promise<void> =>
    client().then(client =>
        client.auth.verifyOtp({ type: 'email', token_hash: token_hash + '' }).then(v =>
            v.error === null ? Promise.resolve() : Promise.reject()
        )
    )