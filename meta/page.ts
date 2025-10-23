import { Metadata } from "next";

const development = process.env.NODE_ENV === 'development'
const name = process.env.NEXT_PUBLIC_SITE_NAME as string
const url = development ? 'http://localhost:3000' : process.env.NEXT_PUBLIC_SITE_URL

const pageMeta = ({ title, description, path, }: { title: string, description: string, path: string }): Metadata => ({
    title: title.includes(name) ? title : `${title} | ${name}`,
    description: description,
    alternates: { canonical: url + path },
    openGraph: {
        type: 'website',
        siteName: name,
        title: title,
        description: description,
        url: url + path,
        images: {
            type: 'image/png',
            alt: name,
            url: `${url}/banner.png`,
            width: 1200,
            height: 630
        }
    }
})

export default pageMeta
