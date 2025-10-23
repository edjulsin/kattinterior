import Edit from '@/components/Edit'
import { getProject } from '@/action/server'
import { notFound } from 'next/navigation'
import pageMeta from '@/meta/page'
import Schema from '@/components/Schema'
import pageSchema from '@/schemas/pageSchema'
import { Project } from '@/type/editor'

const name = process.env.NEXT_PUBLIC_SITE_NAME

export const generateMetadata = async ({ params }: { params: Promise<{ id: string }> }) =>
    params.then(v =>
        pageMeta({
            title: 'Editor',
            description: `Edit ${name} projects from the dashboard.`,
            path: `/dashboard/editor/${v.id}`
        })
    )

const EditorPage = async ({ params }: { params: Promise<{ id: string }> }) =>
    params.then(params =>
        getProject(params.id).then(
            (v: Project[]) => {
                if(v.length > 0) {
                    const [project] = v
                    return (
                        <Schema
                            key={project.id}
                            value={
                                pageSchema({
                                    title: project.title,
                                    description: project.description,
                                    path: `/dashboard/editor/${project.id}`
                                })
                            }
                        >
                            <Edit project={project} />
                        </Schema>
                    )
                } else {
                    notFound()
                }
            },
            () => { notFound() }
        )
    )

export default EditorPage