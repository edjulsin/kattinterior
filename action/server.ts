'use server'

import Contact from '@/email/Contact'
import { isValidEmail } from '@/utility/fn'
import { render } from '@react-email/render'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Resend } from 'resend'
import sanitizer from 'sanitize-html'
import crypto from 'crypto';
import { isEmail } from 'validator'

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
    const address = (email + '').trim()
    if(isValidEmail(address)) {
        return client().then(
            client => client.auth.signInWithOtp({
                email: address,
                options: { shouldCreateUser: false }
            }).then(v =>
                v.error === null
                    ? Promise.resolve(v)
                    : Promise.reject(v)
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
        name: values.name.length > 2 && values.name.length < 50
            ? ''
            : 'Name must contain 2 to 50 characters',
        email: isEmail(values.email) ? '' : 'Invalid email address',
        message: values.message.length > 10 && values.message.length < 1000
            ? ''
            : 'Message must contain 10 to 1000 characters'
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
        const config = {
            idempotencyKey: crypto
                .createHash('sha256')
                .update(`${form.name}${form.email}${form.message}`)
                .digest('hex')
        }

        const content = Contact(form)
        const contents = Promise.all([
            render(content),
            render(content, { plainText: true })
        ])
        return contents.then(([ html, text ]) =>
            smtp().emails.send({
                from: process.env.EMAIL_SENDER!, // insert name here
                to: process.env.EMAIL_RECEIVER!,
                subject: 'Contact from Katt',
                html: html,
                text: text,
                replyTo: form.email
            }, config).then(
                () => client().then(client =>
                    client.from('contacts').upsert({
                        name: form.name,
                        email: form.email,
                        updated_at: new Date().toISOString()
                    }, { onConflict: 'email' }).then(
                        () => Promise.resolve(form),
                        () => Promise.reject({ other: 'Something wrong' })
                    ),
                    () => Promise.reject({ other: 'Something wrong' })
                ),
                () => Promise.reject({ other: 'Something wrong' })
            )
        )
    }
}

export const getProject = async (id: string) => client().then(client =>
    client.from('projects').select('*').eq('id', id + '').limit(1).then(v => {
        if(v.error === null) {
            return Promise.resolve(v.data ?? ([]))
        } else {
            return Promise.reject()
        }
    })
)

export const getFeaturedProject = async () => client().then(client =>
    client
        .from('projects')
        .select('*')
        // .eq('published', true)
        .eq('featured', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .then(v => {
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

export const getPublishedProject = async (slug: string) =>
    client().then(client =>
        client
            .from('projects')
            .select('*')
            // .eq('published', true) //
            .eq('slug', slug)
            .order('created_at', { ascending: false })
            .limit(1)
            .then((v) => {
                if(v.error === null) {
                    return Promise.resolve(v.data ?? ([]))
                } else {
                    return Promise.reject()
                }
            })
    )

export const getNextPublishedProject = async (limit: number, created_at: string) =>
    client().then(client =>
        client
            .from('projects')
            .select('*')
            // .eq('published', true)
            .gt('created_at', created_at)
            .order('created_at', { ascending: true })
            .limit(limit)
            .then((v) => {
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
            // .eq('published', true)
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


export const getAllPublishedProjects = async () =>
    client().then(client =>
        client
            .from('projects')
            .select('*')
            // .eq('published', true)
            .order('created_at', { ascending: false })
            .then(v => {
                if(v.error === null) {
                    return Promise.resolve(v.data ?? ([]))
                } else {
                    return Promise.reject()
                }
            })
    )


export const verifyEmailToken = async (token: string): Promise<void> =>
    client().then(client =>
        client.auth.verifyOtp({ type: 'email', token_hash: token + '' }).then(v =>
            v.error === null && v.data.user ? Promise.resolve() : Promise.reject()
        )
    )


export const getAllContacts = async (start: number, end: number) =>
    client().then(client =>
        client.from('contacts')
            .select('*')
            .order('updated_at', { ascending: false })
            .range(start, end)
            .then(v => {
                if(v.error === null) {
                    return Promise.resolve(v.data ?? ([]))
                } else {
                    return Promise.reject()
                }
            })
    )



export const searchContacts = async (start: number, end: number, search: string) =>
    client().then(client =>
        client
            .from('contacts')
            .select('*')
            .or(`name.ilike.%${search.trim()}%,email.ilike.%${search.trim()}%`)
            .range(start, end)
            .then(v => {
                if(v.error === null) {
                    return Promise.resolve(v.data ?? ([]))
                } else {
                    return Promise.reject()
                }
            })
    )