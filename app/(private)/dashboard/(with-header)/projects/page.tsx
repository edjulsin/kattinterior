import { getProjects } from '@/action/server';
import Error from '@/components/Error';
import Projects from '@/components/Projects';
import Schema from '@/components/Schema';

import pageSchema from '@/schemas/pageSchema'
import { Metadata } from 'next'

const name = process.env.NEXT_PUBLIC_SITE_NAME

export const metadata: Metadata = {
    title: 'Projects',
    description: `Manage and update all ${name} projects from the dashboard.`,
    alternates: {
        canonical: '/dashboard/contacts'
    }
}

const ProjectsDashboard = async () => getProjects(8).then(
    v => <Projects fetchCount={ 8 } projects={ v } />,
    () => <Error title='Database Error' />
).then(content =>
    <Schema
        value={
            pageSchema({
                path: metadata.alternates?.canonical as string,
                description: metadata.description as string
            })
        }
    >
        { content }
    </Schema>
)

export default ProjectsDashboard