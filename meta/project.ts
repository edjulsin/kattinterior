import { Project } from '@/type/editor';
import { Metadata } from "next";

const name = process.env.NEXT_PUBLIC_SITE_NAME as string
const url = process.env.NEXT_PUBLIC_SITE_URL

const projectMeta = (v: Project): Metadata => ({
    title: `${v.title} | By ${name}`,
    description: v.description,
    alternates: { canonical: `${url}/projects/${v.slug}` },
    openGraph: {
        type: 'article',
        siteName: name,
        title: `${v.title} | By ${name}`,
        description: v.description,
        url: `${url}/projects/${v.slug}`,
        section: v.category,
        tags: v.assets.map(v => v.alt.toLowerCase()),
        authors: `${url}/about`,
        publishedTime: v.published_at,
        modifiedTime: v.updated_at
    }
})

export default projectMeta