import { getProject } from '@/action/server'
import { notFound } from 'next/navigation'
import Preview from '@/components/Preview'
import Next from '@/components/Next'
import { Project } from '@/type/editor'
import React from 'react'
import Intersector from '@/components/Intersector'
import Parallax from '@/components/Parallax'
import pageMeta from '@/meta/page'
import Schema from '@/components/Schema'
import pageSchema from '@/schemas/pageSchema'

const name = process.env.NEXT_PUBLIC_SITE_NAME

export const generateMetadata = async ({ params }: { params: Promise<{ id: string }> }) =>
    params.then(v =>
        pageMeta({
            title: 'Preview',
            description: `Preview ${name} project before publishing.`,
            path: `/preview/${v.id}`
        })
    )

const PreviewPage = async ({ params }: { params: Promise<{ id: string }> }) =>
    params.then(v =>
        getProject(v.id).then(
            (v: Project[]) => {
                if(v.length > 0) {
                    const [project] = v
                    return (
                        <Schema
                            value={
                                pageSchema({
                                    title: project.title,
                                    description: project.description,
                                    path: `/preview/${project.id}`
                                })
                            }
                        >
                            <Intersector />
                            <Parallax selectors={['.parallax']} />
                            <Preview project={project} />
                            <Next created_at={project.created_at} />
                        </Schema>
                    )
                } else {
                    notFound()
                }
            },
            () => { notFound() }
        )
    )

export default PreviewPage