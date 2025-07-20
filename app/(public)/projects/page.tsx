import { getPublishedProjects } from '@/action/server'
import Article from '@/components/Article'
import Articles from '@/components/Articles'
import Bottom from '@/components/Bottom'
import { Project } from '@/type/editor'

// import image rather than using string as source for local images
const count = 6

const Message = ({ message }: { message: string }) => (
    <section className='flex flex-col justify-center items-center min-h-[40dvh]'>
        <h1 className='text-center font-serif text-3xl max-w-lg leading-loose'>{ message }</h1>
    </section>
)

const Projects = ({ count, projects }: { count: number, projects: Project[] }) =>
    <section className='flex flex-col gap-y-16'>
        <h1 className='text-center font-serif text-lg'>Design Stories</h1>
        <section
            className='
            grid 
            grid-cols-3
            grid-flow-row-dense
            gap-y-20 
            place-items-center 
            py-14
            [&>a]:row-span-4
            [&>:nth-child(2)]:row-start-3
            [&>a:nth-child(3n+1)]:col-start-1
            [&>a:nth-child(3n+2)]:col-start-2
            [&>a:nth-child(3n+3)]:col-start-3
            [&>*:not(a)]:col-span-3
        '
        >
            {
                projects.map(v =>
                    <Article
                        key={ v.id }
                        project={ v }
                    />
                )
            }
            { projects.length >= count ? <Articles start={ projects.length } count={ count } /> : null }
        </section>
    </section>

const Layout = ({ children }: { children: React.ReactNode }) => (
    <div className='flex flex-col gap-y-40 pt-[8dvh]'>
        { children }
        <Bottom />
    </div>
)

export default () => getPublishedProjects(0, count - 1).then(
    (projects: Project[]) =>
        <Layout>
            {
                projects.length === 0
                    ? <Message message='Oops! Looks like we don’t have any projects right now. Stay tuned!' />
                    : <Projects count={ count } projects={ projects } />
            }
        </Layout>
    ,
    () =>
        <Layout>
            <Message message='Oops! Something went wrong while loading projects. Please try again shortly.' />
        </Layout>
)