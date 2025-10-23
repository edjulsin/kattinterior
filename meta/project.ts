import { Metadata } from "next";

const development = process.env.NODE_ENV === 'development'
const name = process.env.NEXT_PUBLIC_SITE_NAME as string
const url = development ? 'http://localhost:3000' : process.env.NEXT_PUBLIC_SITE_URL

const projectMeta = ({
    title, description, path, type, tags, published_at, updated_at
}: {
    type: string, published_at: string, updated_at: string, tags: string[], title: string, description: string, path: string
}): Metadata => ({
    title: `${title} | By ${name}`,
    description: description,
    alternates: { canonical: url + path },
    openGraph: {
        type: 'article',
        siteName: name,
        title: `${title} | By ${name}`,
        description: description,
        url: url + path,
        section: type,
        tags: tags.map(v => v.toLowerCase()),
        authors: `${url}/about`,
        publishedTime: published_at,
        modifiedTime: updated_at
    }
})

export default projectMeta