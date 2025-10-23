import { Project } from '@/type/editor'
import { capitalize } from '@/utility/fn'
import { CreativeWork, WithContext, ImageObject } from 'schema-dts'

const development = process.env.NODE_ENV === 'development'
const url = development ? 'http://localhost:3000' : process.env.NEXT_PUBLIC_SITE_URL
const name = process.env.NEXT_PUBLIC_SITE_NAME
const instagram = process.env.NEXT_PUBLIC_INSTAGRAM_URL
const banner = `${url}/banner.png`

export default (project: Project): WithContext<CreativeWork> => {
    const thumbnail = project.assets.find(v => v.thumbnail) ?? project.assets[0]
    const image: ImageObject | ({}) = thumbnail
        ? ({
            "image": {
                "@type": "ImageObject",
                "url": thumbnail.src,
                "width": { "@type": "QuantitativeValue", value: thumbnail.width },
                "height": { "@type": "QuantitativeValue", value: thumbnail.height }
            }
        })
        : ({})

    return {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        "name": `${project.name}`,
        "description": project.story,
        "url": `${url}/projects/${project.slug}`,
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
            "@id": `${url}/projects/${project.slug}`,
            "name": project.title,
            "description": project.description
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
                "width": { "@type": "QuantitativeValue", value: 1200 },
                "height": { "@type": "QuantitativeValue", value: 630 }
            },
            "sameAs": instagram
        },
        ...image
    }
}