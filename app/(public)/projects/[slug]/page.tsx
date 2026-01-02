import { getPublishedProject, getAllPublishedProjects } from '@/action/anon'
import { notFound } from 'next/navigation'
import Project from '@/components/Project'
import { isSlug } from 'validator'
import { Project as ProjectType } from '@/type/editor'
import projectSchema from '@/schemas/projectSchema'
import Schema from '@/components/Schema'
import Intersector from '@/components/Intersector'
import Next from '@/components/Next'
import Parallax from '@/components/Parallax'
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
                (v: ProjectType[]) => {
                    const result = v.map(projectMeta)
                    if(result.length > 0) {
                        const [metadata] = result
                        return metadata
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

const ProjectPage = async ({ params }: { params: Promise<{ slug: string }> }) =>
    params.then(
        v => {
            const slug = (v.slug + '').trim().toLowerCase()
            if(isSlug(slug)) {
                return getPublishedProject(slug).then(
                    (v: ProjectType[]) => {
                        if(v.length > 0) {
                            const [project] = v
                            return (
                                <Schema value={projectSchema(project)}>
                                    <Intersector />
                                    <Parallax selectors={['.parallax']} />
                                    <Project {...project} />
                                    <Next created_at={project.created_at} />
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
        }
    )

export default ProjectPage