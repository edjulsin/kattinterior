import Edit from '@/components/Edit'
import { getProject } from '@/action/server'
import { notFound } from 'next/navigation'

import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Editor',
    description: `Edit ${process.env.NEXT_PUBLIC_SITE_NAME} projects from the dashboard.`,
}

const EditorPage = async ({ params }: { params: Promise<{ id: string }> }) =>
    params.then(v =>
        getProject(v.id).then(
            v => v.map(v =>
                <Edit key={ v.id } project={ v } />
            ),
            () => { notFound() }
        )
    )

export default EditorPage