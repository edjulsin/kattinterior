import { getProject } from '@/action/server'
import { notFound } from 'next/navigation'
import Preview from '@/components/Preview'
import Next from '@/components/Next'
import { Project } from '@/type/editor'
import React from 'react'
import Intersector from '@/components/Intersector'
import { Metadata } from 'next'
import Parallax from '@/components/Parallax'

export const metadata: Metadata = {
    title: 'Preview',
    description: `Preview ${process.env.NEXT_PUBLIC_SITE_NAME} projects before publishing.`,
}

const PreviewPage = async ({ params }: { params: Promise<{ id: string }> }) =>
    params.then(v =>
        getProject(v.id).then(
            v => v.map((v: Project) =>
                <React.Fragment key={ v.id }>
                    <Intersector />
                    <Parallax selectors={ [ '.parallax' ] } />
                    <Preview project={ v } />
                    <Next created_at={ v.created_at } />
                </React.Fragment>
            ),
            () => { notFound() }
        )
    )

export default PreviewPage