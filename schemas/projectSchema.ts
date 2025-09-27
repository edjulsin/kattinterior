import { Project } from '@/type/editor'
import { capitalize } from '@/utility/fn'

const url = process.env.NEXT_PUBLIC_SITE_URL
const name = process.env.NEXT_PUBLIC_SITE_NAME
const instagram = process.env.NEXT_PUBLIC_INSTAGRAM_URL
const banner = process.env.NEXT_PUBLIC_BANNER_URL

export default (project: Project) => {
    const thumbnail = project.assets.find(v => v.thumbnail) ?? project.assets[ 0 ]
    const image = thumbnail
        ? ({
            "image": {
                "@type": "ImageObject",
                "url": thumbnail.src,
                "width": thumbnail.width,
                "height": thumbnail.height
            }
        })
        : ({})

    return {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        "name": `${project.title} | By ${name}`,
        "url": `${url}/projects/${project.slug}`,
        "description": project.description,
        ...image,
        "datePublished": project.published_at,
        "dateModified": project.updated_at,
        "locationCreated": {
            "@type": "Place",
            "name": project.location
        },
        "genre": `${capitalize(project.category)} Interior Design`,
        "keywords": project.assets.map(v => v.alt.toLowerCase()).filter(v => v),
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `${url}/projects/${project.slug}`
        },
        "author": {
            "@type": "Organization",
            "name": name,
            "url": `${url}/about`
        },
        "publisher": {
            "@type": "Organization",
            "name": name,
            "logo": {
                "@type": "ImageObject",
                "url": banner,
                "width": 1200,
                "height": 630
            },
            "sameAs": instagram
        }
    }
}