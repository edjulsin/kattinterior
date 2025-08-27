import { getAllPublishedProjects } from '@/action/server'
import { Project } from '@/type/editor'
import type { MetadataRoute } from 'next'

export const revalidate = 60 * 60 * 24 * 7;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const url = process.env.NEXT_PUBLIC_SITE_URL as string
    const modified = new Date().toISOString()
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
            changeFrequency: 'monthly',
            priority: 0.8
        },
        {
            url: `${url}/services`,
            lastModified: modified,
            changeFrequency: 'monthly',
            priority: 0.8
        },
        {
            url: `${url}/commercial-design`,
            lastModified: modified,
            changeFrequency: 'monthly',
            priority: 0.8
        },
        {
            url: `${url}/residential-design`,
            lastModified: modified,
            changeFrequency: 'monthly',
            priority: 0.8
        },
        {
            url: `${url}/projects`,
            lastModified: modified,
            changeFrequency: 'weekly',
            priority: 0.5
        }
    ]

    return getAllPublishedProjects().then(
        (projects: Project[]) => {
            const result: MetadataRoute.Sitemap = projects.map(v => {
                return {
                    url: `${url}/projects/${v.slug}`,
                    lastModified: v.updated_at,
                    changeFrequency: 'monthly',
                    priority: 0.5,
                    images: v.assets.map(v => v.src)
                }
            })
            return [ ...statics, ...result ]
        },
        () => statics
    )
}