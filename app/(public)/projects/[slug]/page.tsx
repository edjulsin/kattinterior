import { getPublishedProject } from '@/action/server'
import { notFound } from 'next/navigation'
import Project from '@/components/Project'
import sanitize from 'sanitize-html'
import { isSlug } from 'validator'
import { Project as ProjectType } from '@/type/editor'
import { Metadata } from "next";
import projectSchema from '@/schemas/projectSchema'
import Schema from '@/components/Schema'
import Intersector from '@/components/Intersector'
import Next from '@/components/Next'
import Parallax from '@/components/Parallax'

export const generateMetadata = async ({ params }: { params: Promise<{ slug: string }> }) =>
    params.then(
        v => {
            const slug = sanitize(v.slug + '').trim().toLowerCase()
            if(isSlug(slug)) {
                return getPublishedProject(slug).then(
                    v => {
                        const result = v.map((v: ProjectType): Metadata => {
                            const url = process.env.NEXT_PUBLIC_SITE_URL
                            const path = `/projects/${v.slug}`
                            const name = process.env.NEXT_PUBLIC_SITE_NAME
                            return {
                                title: v.title,
                                description: v.description,
                                alternates: {
                                    canonical: path
                                },
                                openGraph: {
                                    siteName: name,
                                    title: v.title,
                                    description: v.description,
                                    url: url + path,
                                    type: 'article',
                                    publishedTime: v.published_at,
                                    modifiedTime: v.updated_at,
                                    tags: v.category,
                                    authors: [ `${url}/about` ]
                                },
                                twitter: {
                                    card: 'summary_large_image',
                                    title: v.title,
                                    description: v.description
                                }
                            }
                        })
                        if(result.length > 0) {
                            const [ opengraph ] = result
                            return opengraph
                        } else {
                            return {}
                        }
                    },
                    () => ({})
                )
            } else {
                return {}
            }
        },
        () => ({})
    )

const ProjectPage = async ({ params }: { params: Promise<{ slug: string }> }) =>
    params.then(v => {
        const slug = sanitize(v.slug + '').trim().toLowerCase()
        if(isSlug(slug)) {
            return getPublishedProject(slug).then(
                v => v.map((v: ProjectType) =>
                    <Schema key={ v.id } value={ projectSchema(v) }>
                        <Intersector />
                        <Parallax selectors={ [ '.parallax' ] } />
                        <Project { ...v } />
                        <Next created_at={ v.created_at } />
                    </Schema>
                ),
                () => { notFound() }
            )
        } else {
            notFound()
        }
    })

export default ProjectPage