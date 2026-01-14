'use server'

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { isEmail } from 'validator'
import { revalidatePath } from 'next/cache'
import { EmailOtpType } from '@supabase/supabase-js'
import { deleteUser, inviteUser } from './admin'
import type { User } from '@/type/user'

const roles = ['admin', 'owner']

export const rebuildPath = async (path: string, type?: 'page' | 'layout') => {
    revalidatePath(path, type ?? 'page')
}

const client = async () => cookies().then(store =>
    createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return store.getAll()
                },
                setAll(value: { name: string, value: string, options?: CookieOptions }[]) {
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

type db = Awaited<ReturnType<typeof client>>

export const authorize = async () => client().then(c =>
    c.auth.getClaims().then(v =>
        v.error === null && v.data !== null
            ? Promise.resolve(v.data)
            : Promise.reject(v.error)
    )
)

const getProfile = async (client: db) =>
    client.auth.getClaims().then(v =>
        v.error === null && v.data !== null
            ? Promise.resolve(v.data)
            : Promise.reject(v.error)
    ).then(v => {
        const claims = v.claims
        return {
            id: claims.sub ?? '',
            email: claims.email ?? '',
            name: claims.user_metadata?.name ?? '',
            avatar: claims.user_metadata?.avatar ?? '',
            role: claims.app_metadata?.user_role ?? '',
            confirmed: claims.user_metadata?.email_verified ?? true
        }
    })

export const getUserInfo = async () =>
    client().then(c =>
        getProfile(c).then(user =>
            c.from('users').select('id, name, avatar, confirmed, invites!inner(email), roles!inner(role)').neq('id', user.id).then(v =>
                v.error === null && v.data !== null
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
            ).then(members => {
                return { user, members }
            })
        )
    )

export const inviteByEmail = async (email: string) =>
    client().then(c =>
        getProfile(c).then(async v => {
            const value = email.trim() + ''
            if(isEmail(value) && roles.includes(v.role)) {
                if(v.email === value) {
                    return []
                } else {
                    return inviteUser(v.id, value)
                }
            } else {
                return []
            }
        })
    )

export const deleteMember = async (user: User) =>
    client().then(c =>
        getProfile(c).then(v =>
            roles.includes(v.role) && v.id !== user.id
                ? c.from('users').select('id, roles!inner(role)').eq('id', user.id).neq('id', v.id).limit(1).then(v =>
                    v.error === null
                        ? Promise.all(
                            (v.data ?? ([])).map(v => {
                                return {
                                    id: v.id,
                                    role: 'role' in v.roles ? v.roles.role : v.roles[0].role
                                }
                            }).filter(v =>
                                v.role !== 'admin'
                            ).map(v =>
                                deleteUser(v.id)
                            )
                        )
                        : Promise.reject(v.error)
                )
                : Promise.reject('You are not authorized.')
        )
    )

export const signIn = async (email: string) => {
    const address = (email + '').trim()
    if(isEmail(address)) {
        return client().then(
            c => c.auth.signInWithOtp({
                email: address,
                options: { shouldCreateUser: false }
            }).then(v =>
                v.error === null
                    ? Promise.resolve(v.data)
                    : Promise.reject(v.error)
            )
        )
    } else {
        return Promise.reject('Invalid email')
    }
}

export const signOut = async () =>
    client().then(c =>
        c.auth.signOut()
    )

export const getProject = async (id: string) =>
    client().then(client =>
        client.from('projects').select('*').eq('id', id + '').limit(1).then(v =>
            v.error === null
                ? Promise.resolve(v.data ?? ([]))
                : Promise.reject(v.error)
        )
    )

export const getFeaturedProject = async () =>
    client().then(client =>
        client
            .from('projects')
            .select('*')
            .eq('published', true)
            .eq('featured', true)
            .order('created_at', { ascending: false })
            .limit(1)
            .then(v =>
                v.error === null
                    ? Promise.resolve(v.data ?? ([]))
                    : Promise.reject(v.error)
            )
    )

export const getProjects = async (limit: number) => client().then(c =>
    c.from('projects').select('*').order('created_at', { ascending: false }).limit(limit).then(v =>
        v.error === null
            ? Promise.resolve(v.data ?? ([]))
            : Promise.reject(v.error)
    )
)

export const getPublishedProject = async (slug: string) =>
    client().then(client =>
        client
            .from('projects')
            .select('*')
            .eq('published', true)
            .eq('slug', slug)
            .order('created_at', { ascending: false })
            .limit(1)
            .then(v =>
                v.error === null
                    ? Promise.resolve(v.data ?? ([]))
                    : Promise.reject(v.error)
            )
    )

export const getNextPublishedProject = async (limit: number, created_at: string) =>
    client().then(client =>
        client
            .from('projects')
            .select('*')
            .eq('published', true)
            .gt('created_at', created_at)
            .order('created_at', { ascending: true })
            .limit(limit)
            .then(v =>
                v.error === null
                    ? Promise.resolve(v.data ?? ([]))
                    : Promise.reject(v.error)
            )
    )

export const getPublishedProjects = async (start: number, end: number) =>
    client().then(client =>
        client
            .from('projects')
            .select('*')
            .eq('published', true)
            .order('created_at', { ascending: false })
            .range(start, end)
            .then(v =>
                v.error === null
                    ? Promise.resolve(v.data ?? ([]))
                    : Promise.reject(v.error)
            )
    )

export const getAllPublishedProjects = async () =>
    client().then(client =>
        client
            .from('projects')
            .select('*')
            .eq('published', true)
            .order('created_at', { ascending: false })
            .then(v =>
                v.error === null
                    ? Promise.resolve(v.data ?? ([]))
                    : Promise.reject(v.error)
            )
    )

export const verifyToken = async ({ type, token_hash }: { type: EmailOtpType, token_hash: string }) =>
    client().then(c =>
        c.auth.verifyOtp({ type, token_hash }).then(async v =>
            v.error === null && v.data !== null
                ? Promise.resolve(v.data)
                : Promise.reject(v.error)
        )
    )

export const getAllContacts = async (start: number, end: number) =>
    client().then(client =>
        client
            .from('contacts')
            .select('*')
            .order('updated_at', { ascending: false })
            .range(start, end)
            .then(v =>
                v.error === null && v.data !== null
                    ? Promise.resolve(v.data)
                    : Promise.reject(v.error)
            )
    )

export const searchContacts = async (start: number, end: number, search: string) =>
    client().then(client =>
        client
            .from('contacts')
            .select('*')
            .or(`name.ilike.%${search.trim()}%,email.ilike.%${search.trim()}%`)
            .range(start, end)
            .then(v =>
                v.error === null && v.data !== null
                    ? Promise.resolve(v.data)
                    : Promise.reject(v.error)
            )
    )