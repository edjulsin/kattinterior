import { getProject } from '@/action/server'
import { notFound } from 'next/navigation'
import Preview from '@/components/Preview'

export default async ({ params }: { params: Promise<{ id: string }> }) =>
    params.then(v =>
        getProject(v.id).then(
            v => v.map(v =>
                <Preview key={ v.id } project={ v } />
            ),
            () => { notFound() }
        )
    )