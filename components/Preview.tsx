'use client'

import { Project } from '@/type/editor'
import { useEffect, useState } from 'react'
import Post from './Project'

export default ({ project }: { project: Project }) => {
    const [ data, setData ] = useState<Project>(project)

    useEffect(() => {
        const broadcast = new BroadcastChannel(project.id)
        const callback = (e: MessageEvent) => setData(e.data)

        broadcast.addEventListener('message', callback)

        return () => {
            broadcast.removeEventListener('message', callback)
            broadcast.close()
        }
    }, [])

    return <Post { ...data } />
}