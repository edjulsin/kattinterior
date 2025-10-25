import { getPublishedProjects } from '@/action/admin'
import Article from '@/components/Article'
import Articles from '@/components/Articles'
import Bottom from '@/components/Bottom'
import Gallery from '@/components/Gallery'
import Schema from '@/components/Schema'
import pageMeta from '@/meta/page'
import projectsSchema from '@/schemas/projectsSchema'
import { Project } from '@/type/editor'
import { Metadata } from 'next'

const count = 6

const Message = ({ message }: { message: string }) =>
    <section className='flex flex-col justify-center items-center min-h-[50dvh]'>
        <h1 className='text-center font-serif text-3xl max-w-lg leading-loose'>{message}</h1>
    </section>

const meta = {
    title: 'Projects',
    description: 'Explore a curated portfolio of residential and commercial interior design projects by Katt Interior Studio. Featuring villas, homes, retail spaces, and hospitality interiors across Bali.',
    path: '/projects'
}

export const dynamic = 'force-static'

export const metadata: Metadata = pageMeta(meta)

const ProjectsPage = async () => getPublishedProjects(0, count - 1).then(
    (projects: Project[]) =>
        projects.length === 0
            ? <Message message='Oops! Looks like we don’t have any projects right now. Stay tuned!' />
            : <Gallery heading='h1'>

                {
                    projects.map((v, i) =>
                        <Article
                            heading='h2'
                            index={i}
                            key={v.id}
                            project={v}
                        />
                    )
                }
                {
                    projects.length >= count
                        ? <Articles
                            heading='h2'
                            start={projects.length}
                            count={count}
                        />
                        : null
                }
            </Gallery>
    ,
    () => <Message message='Oops! Something went wrong while loading projects. Please try again shortly.' />
).then(children =>
    <Schema value={projectsSchema(meta)}>
        {children}
        <Bottom />
    </Schema>
)

export default ProjectsPage