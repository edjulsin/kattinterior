import { getAllPublishedProjects } from '@/action/anon'
import { Project } from '@/type/editor'
import type { MetadataRoute } from 'next'

const url = process.env.NEXT_PUBLIC_SITE_URL as string

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const modified = new Date()
    const statics: MetadataRoute.Sitemap = [
        {
            url: url,
            lastModified: modified,
            changeFrequency: 'yearly',
            priority: 1
        },
        {
            url: `${url}/about`,
            lastModified: modified,
            changeFrequency: 'monthly',
            priority: 0.8
        },
        {
            url: `${url}/contact`,
            lastModified: modified,
            changeFrequency: 'yearly',
            priority: 0.8
        },
        {
            url: `${url}/services`,
            lastModified: modified,
            changeFrequency: 'monthly',
            priority: 0.8
        },
        {
            url: `${url}/services/packages`,
            lastModified: modified,
            changeFrequency: 'monthly',
            priority: 0.8
        },
        {
            url: `${url}/projects`,
            lastModified: modified,
            changeFrequency: 'monthly',
            priority: 0.5
        }
    ]

    return getAllPublishedProjects().then(
        (projects: Project[]) => {
            const result: MetadataRoute.Sitemap = projects.map(v => {
                return {
                    url: `${url}/projects/${v.slug}`,
                    lastModified: new Date(v.updated_at) as Date,
                    changeFrequency: 'monthly',
                    priority: 0.5,
                    images: v.assets.map(v => v.src)
                }
            })
            return [...statics, ...result]
        },
        () => statics
    )
}