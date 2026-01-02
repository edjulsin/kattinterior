'use server'

import { createClient } from '@supabase/supabase-js'
import { isEmail } from 'validator'

const client = () => createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
)

export const signIn = async (email: string) => {
    if(isEmail(email)) {
        return client().auth.signInWithOtp({
            email: email,
            options: { shouldCreateUser: false }
        }).then(v =>
            v.error === null
                ? Promise.resolve(v.data)
                : Promise.reject(v.error)
        )
    } else {
        return Promise.reject('Invalid email')
    }
}

export const signOut = async () => client().auth.signOut()

export const getPublishedProjects = async (start: number, end: number) =>
    client()
        .from('projects')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false })
        .range(start, end)
        .then(v =>
            v.error === null
                ? Promise.resolve(v.data)
                : Promise.reject(v.error)
        )

export const getAllPublishedProjects = async () =>
    client()
        .from('projects')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false })
        .then(v =>
            v.error === null
                ? Promise.resolve(v.data)
                : Promise.reject(v.error)
        )

export const getFeaturedProject = async () =>
    client()
        .from('projects')
        .select('*')
        .eq('published', true)
        .eq('featured', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .then(v =>
            v.error === null
                ? Promise.resolve(v.data)
                : Promise.reject(v.error)
        )

export const getNextPublishedProject = async (limit: number, created_at: string) =>
    client()
        .from('projects')
        .select('*')
        .eq('published', true)
        .gt('created_at', created_at)
        .order('created_at', { ascending: true })
        .limit(limit)
        .then(v =>
            v.error === null
                ? Promise.resolve(v.data)
                : Promise.reject(v.error)
        )

export const getPublishedProject = async (slug: string) =>
    client()
        .from('projects')
        .select('*')
        .eq('published', true)
        .eq('slug', slug)
        .order('created_at', { ascending: false })
        .limit(1)
        .then(v =>
            v.error === null
                ? Promise.resolve(v.data)
                : Promise.reject(v.error)
        )