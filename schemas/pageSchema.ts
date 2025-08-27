export default ({ path, description }: { path: string, description: string }) => {
    const URL = process.env.NEXT_PUBLIC_SITE_URL
    return {
        "@context": "https://schema.org/",
        "@type": "WebSite",
        "url": URL + path,
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": URL + path
        },
        "image": {
            "@type": "ImageObject",
            "url": `${URL}/banner.png`,
            "width": 1200,
            "height": 630
        },
        "description": description
    }
}