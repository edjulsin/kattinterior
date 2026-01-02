import { getProjects } from '@/action/server';
import Error from '@/components/Error';
import Projects from '@/components/Projects';
import Schema from '@/components/Schema';
import pageMeta from '@/meta/page';
import pageSchema from '@/schemas/pageSchema'
import { Metadata } from 'next'

const name = process.env.NEXT_PUBLIC_SITE_NAME
const meta = {
    title: 'Projects',
    description: `Manage and update all ${name} projects from the dashboard.`,
    path: '/dashboard/projects'
}

export const metadata: Metadata = pageMeta(meta)

const ProjectsDashboard = async () => getProjects(8).then(
    v => <Projects fetchCount={8} projects={v} />,
    () => <Error title='Database Error' />
).then(content =>
    <Schema value={pageSchema(meta)}>
        {content}
    </Schema>
)

export default ProjectsDashboard