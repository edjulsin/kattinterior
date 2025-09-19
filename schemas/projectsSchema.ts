export default ({ path, description }: { path: string, description: string }) => {
    const URL = process.env.NEXT_PUBLIC_SITE_URL
    return {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "Interior Design Projects",
        "url": URL + path,
        "description": description,
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": URL + path
        },
        "publisher": {
            "@type": "Organization",
            "name": process.env.NEXT_PUBLIC_SITE_NAME,
            "url": URL,
            "logo": {
                "@type": "ImageObject",
                "url": `${URL}/banner.png`,
                "width": 1200,
                "height": 630
            },
            "sameAs": process.env.NEXT_PUBLIC_INSTAGRAM_URL
        }
    }
}