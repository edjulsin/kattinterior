'use client'

import { useState } from 'react'
import Loader from './Loader'
import Message from './Message'
import Article from './Article'
import { Project } from '@/type/editor'
import { getPublishedProjects } from '@/action/admin'

const Articles = ({ heading, start, count }: { heading: string, start: number, count: number }) => {
    const [data, setData] = useState<Project[]>([])
    const [loader, setLoader] = useState(true)
    const [error, setError] = useState(false)

    const callback = (entries: IntersectionObserverEntry[]) => {
        const intersects = entries.filter(v => v.isIntersecting)
        const from = data.length || start
        const to = from + count

        intersects.forEach(() =>
            getPublishedProjects(from, to).then(
                v => {
                    setLoader(v.length >= count)
                    setError(false)
                    setData(data =>
                        data.concat(v)
                    )
                },
                () => {
                    setLoader(false)
                    setError(true)
                }
            )
        )
    }

    return (
        <Loader key={data.length} enabled={loader} callback={callback}>
            {
                data.map((v, i) =>
                    <Article
                        heading={heading}
                        index={start + i}
                        key={v.id}
                        project={v}
                    />
                )
            }
            {error ? <Message message='Something wrong' /> : null}
        </Loader>
    )
}

export default Articles