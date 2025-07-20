import Edit from '@/components/Edit'
import { getProject } from '@/action/server'
import { notFound } from 'next/navigation'

export default async ({ params }: { params: Promise<{ id: string }> }) =>
    params.then(v =>
        getProject(v.id).then(
            v => v.map(v =>
                <Edit key={ v.id } project={ v } />
            ),
            () => { notFound() }
        )
    )