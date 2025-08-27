import { Project } from '@/type/editor'

export default (project: Project) => {
    const URL = process.env.NEXT_PUBLIC_SITE_URL
    const name = process.env.NEXT_PUBLIC_SITE_NAME
    const thumbnail = project.assets.find(v => v.thumbnail) ?? project.assets[ 0 ]
    return {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        "name": project.title,
        "url": `${URL}/projects/${project.slug}`,
        "description": project.description,
        "image": {
            "@type": "ImageObject",
            "url": thumbnail.src,
            "width": thumbnail.width,
            "height": thumbnail.height
        },
        "datePublished": project.published_at,
        "dateModified": project.updated_at,
        "locationCreated": {
            "@type": "Place",
            "name": `${project.location}`
        },
        "genre": `${project.category} Interior Design`,
        "keywords": project.assets.map(v => v.alt.toLowerCase()).filter(v => v),
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `${URL}/projects/${project.slug}`
        },
        "author": {
            "@type": "Organization",
            "name": name,
            "url": `${URL}/about`
        },
        "publisher": {
            "@type": "Organization",
            "name": name,
            "logo": {
                "@type": "ImageObject",
                "url": `${URL}/banner.png`,
                "width": 1200,
                "height": 630
            },
            "sameAs": "https://www.instagram.com/kattinterior"
        }
    }
}