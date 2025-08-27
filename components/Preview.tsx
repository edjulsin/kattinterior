'use client'

import { Project as ProjectType } from '@/type/editor'
import { useEffect, useState } from 'react'
import Project from './Project'

const Preview = ({ project }: { project: ProjectType }) => {
    const [ data, setData ] = useState<ProjectType>(project)

    useEffect(() => {
        const broadcast = new BroadcastChannel(project.id)
        const callback = (e: MessageEvent) => setData(e.data)

        broadcast.addEventListener('message', callback)

        return () => {
            broadcast.removeEventListener('message', callback)
            broadcast.close()
        }
    }, [])

    return <Project { ...data } />
}

export default Preview