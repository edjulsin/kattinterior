'use client'

import { toPathURL } from '@/utility/fn';
import { createBrowserClient } from '@supabase/ssr'
import * as tus from 'tus-js-client'
import { Project } from '@/type/editor';
import { v7 as UUIDv7 } from 'uuid'

const client = () => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_KEY!
)

export const uploadFiles = (
    signal: AbortSignal,
    files: [string, Blob][]
) =>
    client().auth.getSession().then(({ data }) =>
        data?.session?.access_token
            ? Promise.all(
                files.map(([name, file]) =>
                    new Promise<void>((resolve, reject) => {
                        const upload = new tus.Upload(file, {
                            endpoint: `${process.env.NEXT_PUBLIC_SUPABASE_URL!}/storage/v1/upload/resumable`,
                            retryDelays: [0, 3000, 5000, 10000, 20000],
                            removeFingerprintOnSuccess: true,
                            headers: {
                                authorization: `Bearer ${data.session.access_token}`
                            },
                            uploadDataDuringCreation: true,
                            chunkSize: 6 * 1024 * 1024,
                            metadata: {
                                bucketName: process.env.NEXT_PUBLIC_SUPABASE_BUCKET!,
                                objectName: toPathURL(name),
                                contentType: file.type,
                                cacheControl: 3600 + ''
                            },
                            onError: () => reject(),
                            onSuccess: () => resolve(),
                        })

                        const cancel = () => {
                            upload.abort()
                            resolve()
                        }

                        signal.addEventListener('abort', cancel, { once: true })

                        return upload.findPreviousUploads().then(
                            v => {
                                if(v.length) {
                                    upload.resumeFromPreviousUpload(v[0])
                                }

                                upload.start()
                            }),
                            reject
                    })
                )
            )
            : Promise.reject()
    )

export const deleteFiles = (paths: string[]) =>
    client().storage.from(process.env.NEXT_PUBLIC_SUPABASE_BUCKET!).remove(
        paths.map(v =>
            toPathURL(v)
        )
    )

export const signIn = (email: string) =>
    client().auth.signInWithOtp({
        email: email + '',
        options: { shouldCreateUser: false }
    }).then(v =>
        v.error === null
            ? Promise.resolve()
            : Promise.reject()
    )

export const signOut = () => client().auth.signOut()

export const createProject = async () => {
    const id = UUIDv7()
    const category = 'residential'
    const template = {
        desktop: {
            edited: false,
            width: 1280,
            height: 0,
            items: []
        },
        tablet: {
            edited: false,
            width: 768,
            height: 0,
            items: []
        },
        mobile: {
            edited: false,
            width: 384,
            height: 0,
            items: []
        }
    }
    return client().from('projects').insert({ id, template, category }).then(() => id)
}

export const updateProject = async (project: Partial<Project>) => {
    const changes = {
        ...project,
        updated_at: new Date().toISOString()
    }

    const init = () => client().from('projects')
    const update = () => init().update(changes).eq('id', project.id).then(v =>
        v.error === null
            ? Promise.resolve()
            : Promise.reject()
    )
    if('featured' in changes && changes.featured) {
        return init()
            .update({ featured: false, updated_at: changes.updated_at })
            .eq('featured', true)
            .neq('id', project.id)
            .then(update)
    } else {
        return update()
    }
}

export const deleteProject = async (id: string) => client().from('projects').delete().eq('id', id)

export const getAllProjects = async (start: number, end: number) =>
    client()
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })
        .range(start, end)
        .then(v => {
            if(v.error === null) {
                return Promise.resolve(v.data ?? ([]))
            } else {
                return Promise.reject()
            }
        })


export const getDraftProjects = async (start: number, end: number) =>
    client()
        .from('projects')
        .select('*')
        .eq('published', false)
        .order('created_at', { ascending: false })
        .range(start, end)
        .then(v => {
            if(v.error === null) {
                return Promise.resolve(v.data ?? ([]))
            } else {
                return Promise.reject()
            }
        })


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


export const getFeaturedProjects = async (start: number, end: number) =>
    client()
        .from('projects')
        .select('*')
        .eq('featured', true)
        .order('created_at', { ascending: false })
        .range(start, end)
        .then(v => {
            if(v.error === null) {
                return Promise.resolve(v.data ?? ([]))
            } else {
                return Promise.reject()
            }
        })


export const getNewestProjects = getAllProjects

export const getOldestProjects = async (start: number, end: number) =>
    client()
        .from('projects')
        .select('*')
        .order('created_at', { ascending: true })
        .range(start, end)
        .then(v => {
            if(v.error === null) {
                return Promise.resolve(v.data ?? ([]))
            } else {
                return Promise.reject()
            }
        })


export const getRecentProjects = async (start: number, end: number) =>
    client()
        .from('projects')
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

export const searchProjects = async (start: number, end: number, search: string[]) =>
    client()
        .from('projects')
        .select('*')
        .ilikeAnyOf('name', search.map(v => `%${v.trim()}%`))
        .range(start, end)
        .then(v => {
            if(v.error === null) {
                return Promise.resolve(v.data ?? ([]))
            } else {
                return Promise.reject()
            }
        })


export const getAllContacts = async (start: number, end: number) =>
    client()
        .from('contacts')
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


export const searchContacts = async (start: number, end: number, search: string) =>
    client()
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