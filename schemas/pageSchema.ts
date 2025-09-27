const url = process.env.NEXT_PUBLIC_SITE_URL
const banner = process.env.NEXT_PUBLIC_BANNER_URL

export default ({ path, description }: { path: string, description: string }) => ({
    "@context": "https://schema.org/",
    "@type": "WebSite",
    "url": url + path,
    "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": url + path
    },
    "image": {
        "@type": "ImageObject",
        "url": banner,
        "width": 1200,
        "height": 630
    },
    "description": description
})