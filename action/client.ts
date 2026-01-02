'use client'

import { toPathURL } from '@/utility/fn';
import { createBrowserClient } from '@supabase/ssr'
import * as tus from 'tus-js-client'
import { Photos, Project } from '@/type/editor';
import { v7 as UUIDv7 } from 'uuid'
import type { User } from '@/type/user';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!

const client = () => createBrowserClient(url, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export const uploadFile = (bucketName: string, path: string, blob: Blob) =>
    client().storage.from(bucketName).upload(toPathURL(path), blob)

export const uploadFiles = (
    bucketName: string,
    files: [string, Blob][],
    signal: AbortSignal
) =>
    client().auth.getSession().then(({ data }) =>
        data?.session?.access_token
            ? Promise.all(
                files.map(([name, file]) =>
                    new Promise<void>((resolve, reject) => {
                        const upload = new tus.Upload(file, {
                            endpoint: `${url}/storage/v1/upload/resumable`,
                            retryDelays: [0, 3000, 5000, 10000, 20000],
                            removeFingerprintOnSuccess: true,
                            headers: {
                                authorization: `Bearer ${data.session.access_token}`
                            },
                            uploadDataDuringCreation: true,
                            chunkSize: 6 * 1024 * 1024,
                            metadata: {
                                bucketName: bucketName,
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
            : Promise.reject('You are not authorized')
    )

export const deleteFiles = (bucketName: string, paths: string[]) =>
    client().storage.from(bucketName).remove(
        paths.map(v =>
            toPathURL(v)
        )
    ).then(v =>
        v.error === null
            ? Promise.resolve(v.data)
            : Promise.reject(v.error)
    )

export const signIn = (email: string) =>
    client().auth.signInWithOtp({
        email: email + '',
        options: { shouldCreateUser: false }
    }).then(v =>
        v.error === null
            ? Promise.resolve(v.data)
            : Promise.reject(v.error)
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
    const assets: Photos = []
    return client().from('projects').insert({ id, template, category, assets }).then(v =>
        v.error === null
            ? Promise.resolve(id)
            : Promise.reject(v.error)
    )
}

export const updateProject = async (project: Partial<Project>) => {
    const changes = { ...project, updated_at: new Date().toISOString() }
    const connection = client()
    const update = () =>
        connection
            .from('projects')
            .update(changes)
            .eq('id', project.id)
            .then(v =>
                v.error === null
                    ? Promise.resolve(v.data)
                    : Promise.reject(v.error)
            )

    if('featured' in changes && changes.featured) {
        return connection
            .from('projects')
            .update({ featured: false, updated_at: changes.updated_at })
            .eq('featured', true)
            .neq('id', project.id)
            .then(v =>
                v.error === null
                    ? update()
                    : Promise.reject(v.data)
            )
    } else {
        return update()
    }
}

export const deleteProject = async (id: string) =>
    client().from('projects').delete().eq('id', id).then(v =>
        v.error === null
            ? Promise.resolve(v.data)
            : Promise.reject(v.error)
    )

export const getAllProjects = async (start: number, end: number) =>
    client()
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })
        .range(start, end)
        .then(v =>
            v.error === null
                ? Promise.resolve(v.data ?? ([]))
                : Promise.reject(v.error)
        )

export const getDraftProjects = async (start: number, end: number) =>
    client()
        .from('projects')
        .select('*')
        .eq('published', false)
        .order('created_at', { ascending: false })
        .range(start, end)
        .then(v =>
            v.error === null
                ? Promise.resolve(v.data ?? ([]))
                : Promise.reject(v.error)
        )

export const getPublishedProjects = async (start: number, end: number) =>
    client()
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

export const getFeaturedProjects = async (start: number, end: number) =>
    client()
        .from('projects')
        .select('*')
        .eq('featured', true)
        .order('created_at', { ascending: false })
        .range(start, end)
        .then(v =>
            v.error === null
                ? Promise.resolve(v.data ?? ([]))
                : Promise.reject(v.error)
        )

export const getNewestProjects = getAllProjects

export const getOldestProjects = async (start: number, end: number) =>
    client()
        .from('projects')
        .select('*')
        .order('created_at', { ascending: true })
        .range(start, end)
        .then(v =>
            v.error === null
                ? Promise.resolve(v.data ?? ([]))
                : Promise.reject(v.error)
        )

export const getRecentProjects = async (start: number, end: number) =>
    client()
        .from('projects')
        .select('*')
        .order('updated_at', { ascending: false })
        .range(start, end)
        .then(v =>
            v.error === null
                ? Promise.resolve(v.data ?? ([]))
                : Promise.reject(v.error)
        )

export const searchProjects = async (start: number, end: number, search: string[]) =>
    client()
        .from('projects')
        .select('*')
        .ilikeAnyOf('name', search.map(v => `%${v.trim()}%`))
        .range(start, end)
        .then(v =>
            v.error === null
                ? Promise.resolve(v.data ?? ([]))
                : Promise.reject(v.error)
        )

export const getAllContacts = async (start: number, end: number) =>
    client()
        .from('contacts')
        .select('*')
        .order('updated_at', { ascending: false })
        .range(start, end)
        .then(v =>
            v.error === null
                ? Promise.resolve(v.data ?? ([]))
                : Promise.reject(v.error)
        )

export const searchContacts = async (start: number, end: number, search: string) =>
    client()
        .from('contacts')
        .select('*')
        .or(`name.ilike.%${search.trim()}%,email.ilike.%${search.trim()}%`)
        .range(start, end)
        .then(v =>
            v.error === null
                ? Promise.resolve(v.data ?? ([]))
                : Promise.reject(v.error)
        )

export const updateProfile = async (user: User) => {
    const c = client()
    const data = Object.fromEntries(
        Object.entries(user).filter(([k]) =>
            ['name', 'avatar'].includes(k)
        )
    )
    return Promise.all([
        c.auth.updateUser({ data }).then(v =>
            v.error === null
                ? Promise.resolve(v.data)
                : Promise.reject(v.error)
        ),
        c.from('users').update({ ...data }).eq('id', user.id).then(v =>
            v.error === null
                ? Promise.resolve(v.data)
                : Promise.reject(v.error)
        )
    ]).then(() =>
        c.auth.refreshSession().then(v =>
            v.error === null
                ? Promise.resolve(v.data)
                : Promise.reject(v.error)
        )
    )
}

export const updateRole = async (user: User) =>
    client().from('roles').update({ role: user.role }).eq('user_id', user.id).then(v =>
        v.error === null
            ? Promise.resolve(v.data)
            : Promise.reject(v.error)
    )