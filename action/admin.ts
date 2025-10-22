'use server'

import { createClient } from '@supabase/supabase-js'

const client = () => createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_KEY as string
)

export const getPublishedProjects = async (start: number, end: number) =>
    client()
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

export const getAllPublishedProjects = async () =>
    client()
        .from('projects')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false })
        .then(v => {
            if(v.error === null) {
                return Promise.resolve(v.data ?? ([]))
            } else {
                return Promise.reject()
            }
        })

export const getFeaturedProject = async () =>
    client()
        .from('projects')
        .select('*')
        .eq('published', true)
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

export const getNextPublishedProject = async (limit: number, created_at: string) =>
    client()
        .from('projects')
        .select('*')
        .eq('published', true)
        .gt('created_at', created_at)
        .order('created_at', { ascending: true })
        .limit(limit)
        .then(v => {
            if(v.error === null) {
                return Promise.resolve(v.data ?? ([]))
            } else {
                return Promise.reject()
            }
        })

export const getPublishedProject = async (slug: string) =>
    client()
        .from('projects')
        .select('*')
        .eq('published', true)
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