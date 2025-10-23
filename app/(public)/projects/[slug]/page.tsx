import { getPublishedProject } from '@/action/admin'
import { notFound } from 'next/navigation'
import Project from '@/components/Project'
import { isSlug } from 'validator'
import { Project as ProjectType } from '@/type/editor'
import { Metadata } from "next";
import projectSchema from '@/schemas/projectSchema'
import Schema from '@/components/Schema'
import Intersector from '@/components/Intersector'
import Next from '@/components/Next'
import Parallax from '@/components/Parallax'
import { getAllPublishedProjects } from '@/action/admin'
import projectMeta from '@/meta/project'

export const dynamicParams = false

export const generateStaticParams = async () =>
    getAllPublishedProjects().then(
        v => v.map((v: ProjectType) => {
            return { slug: v.slug }
        }),
        () => ([])
    )

export const generateMetadata = async ({ params }: { params: Promise<{ slug: string }> }) =>
    params.then(v => {
        const slug = (v.slug + '').trim().toLowerCase()
        if(isSlug(slug)) {
            return getPublishedProject(slug).then(
                v => {
                    const result = v.map((v: ProjectType): Metadata => {
                        return projectMeta({
                            title: v.title,
                            description: v.description,
                            path: `/projects/${v.slug}`,
                            tags: v.assets.map(v => v.alt),
                            type: v.category,
                            published_at: v.published_at,
                            updated_at: v.updated_at
                        })
                    })
                    if(result.length > 0) {
                        const [opengraph] = result
                        return opengraph
                    } else {
                        return {}
                    }
                },
                () => { notFound() }
            )
        } else {
            notFound()
        }
    })

const ProjectPage = async ({ params }: { params: Promise<{ slug: string }> }) =>
    params.then(v => {
        const slug = (v.slug + '').trim().toLowerCase()
        if(isSlug(slug)) {
            return getPublishedProject(slug).then(
                v => {
                    if(v.length > 0) {
                        return v.map((v: ProjectType) =>
                            <Schema key={v.id} value={projectSchema(v)}>
                                <Intersector />
                                <Parallax selectors={['.parallax']} />
                                <Project {...v} />
                                <Next created_at={v.created_at} />
                            </Schema>
                        )
                    } else {
                        notFound()
                    }
                },
                () => { notFound() }
            )
        } else {
            notFound()
        }
    })

export default ProjectPage