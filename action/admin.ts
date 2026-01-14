'use server'

import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { sanitize } from '@/utility/fn'
import crypto from 'crypto'
import { render, toPlainText } from '@react-email/render'
import Contact from '@/emails/Contact'
import { isEmail } from 'validator'

const siteName = process.env.NEXT_PUBLIC_SITE_NAME as string
const siteURL = process.env.NEXT_PUBLIC_SITE_URL as string
const emailFrom = process.env.SMTP_EMAIL_FROM as string
const emailTo = process.env.SMTP_EMAIL_TO as string

const logo = { src: `${siteURL}/banner.png`, width: 1200, height: 630, alt: siteName }

const smtp = () => new Resend(process.env.SMTP_API_KEY!)

const client = () => createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.SUPABASE_SECRET_KEY as string
)

type db = ReturnType<typeof client>

export const confirmUser = async (id: string) =>
    client().from('users').update({
        confirmed: true,
        updated_at: new Date().toISOString()
    }).eq('id', id).then(v =>
        v.error === null
            ? Promise.resolve(v.data)
            : Promise.reject(v.error)
    )

export const getUserByEmail = async (client: db, email: string) =>
    client
        .from('users')
        .select('id, name, avatar, confirmed, invites!inner(email), roles!inner(role)')
        .eq('invites.email', email)
        .limit(1)
        .then(v =>
            v.error === null
                ? (v.data ?? ([])).map(v => {
                    return {
                        id: v.id,
                        name: v.name,
                        avatar: v.avatar,
                        confirmed: v.confirmed,
                        email: 'email' in v.invites ? v.invites.email : v.invites[0].email,
                        role: 'role' in v.roles ? v.roles.role : v.roles[0].role
                    }
                })
                : Promise.reject(v.error)
        )

export const getUserByID = async (client: db, id: string) =>
    client
        .from('users')
        .select('id, name, avatar, confirmed, invites!inner(email), roles!inner(role)')
        .eq('id', id)
        .limit(1)
        .then(v =>
            v.error === null
                ? (v.data ?? ([])).map(v => {
                    return {
                        id: v.id,
                        name: v.name,
                        avatar: v.avatar,
                        confirmed: v.confirmed,
                        email: 'email' in v.invites ? v.invites.email : v.invites[0].email,
                        role: 'role' in v.roles ? v.roles.role : v.roles[0].role
                    }
                })
                : Promise.reject(v.error)
        )

export const deleteUser = async (id: string) =>
    client().auth.admin.deleteUser(id).then(v =>
        v.error === null
            ? Promise.resolve(v.data)
            : Promise.reject(v.error)
    )

export const inviteUser = async (admin: string, email: string) => {
    const c = client()
    return getUserByEmail(c, email).then(async v => {
        if(v.length > 0) {
            return Promise.all(
                v.filter(v => v.role !== 'admin').map(async v => {
                    const task = v.confirmed
                        ? c.auth.signInWithOtp({
                            email: email,
                            options: { shouldCreateUser: false }
                        })
                        : c.auth.resend({ type: 'signup', email: email })

                    return task.then(() =>
                        c.from('invites').update({ updated_at: new Date().toISOString() }).eq('email', v.email)
                    ).then(() => v)
                })
            )
        } else {
            return c.auth.admin.inviteUserByEmail(email, { data: { name: '', avatar: '' } }).then(async v => {
                if(v.error === null && v.data.user.email) {
                    const user = {
                        id: v.data.user.id,
                        email: email,
                        avatar: '',
                        name: '',
                        confirmed: false,
                        role: 'contributor'
                    }
                    return c.from('invites').insert({
                        user_id: user.id,
                        invited_by: admin,
                        email: user.email
                    }).then(() => {
                        return [user]
                    })
                } else {
                    return Promise.reject(v.error)
                }
            })
        }
    })
}

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
    }).filter(([_, v]) => v)

    if(errors.length > 0) {
        return Promise.reject(
            errors.reduce((a, [k, v]) => ({ ...a, [k]: v }), {})
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
        const content = Contact({ ...form, logo })
        return render(content).then(v =>
            smtp().emails.send({
                from: `${siteName} <${emailFrom}>`,
                to: emailTo,
                subject: 'New Contact Form',
                html: v,
                text: toPlainText(v),
                replyTo: form.email
            }, config).then(
                () => client().from('contacts').upsert({
                    name: form.name,
                    email: form.email,
                    updated_at: new Date().toISOString()
                }, { onConflict: 'email' }).then(
                    () => Promise.resolve(form),
                    () => Promise.reject({ other: 'Something wrong' })
                ),
                () => Promise.reject({ other: 'Something wrong' })
            )
        )
    }
}