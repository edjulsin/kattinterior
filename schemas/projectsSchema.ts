const url = process.env.NEXT_PUBLIC_SITE_URL
const name = process.env.NEXT_PUBLIC_SITE_NAME
const instagram = process.env.NEXT_PUBLIC_INSTAGRAM_URL
const banner = process.env.NEXT_PUBLIC_BANNER_URL

export default ({ path, description }: { path: string, description: string }) => ({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Interior Design Projects",
    "url": url + path,
    "description": description,
    "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": url + path
    },
    "publisher": {
        "@type": "Organization",
        "name": name,
        "url": url,
        "logo": {
            "@type": "ImageObject",
            "url": banner,
            "width": 1200,
            "height": 630
        },
        "sameAs": instagram
    }
})