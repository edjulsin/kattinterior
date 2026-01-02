import type { CollectionPage, WithContext } from 'schema-dts'

const url = process.env.NEXT_PUBLIC_SITE_URL
const name = process.env.NEXT_PUBLIC_SITE_NAME
const instagram = process.env.NEXT_PUBLIC_INSTAGRAM_URL
const banner = `${url}/banner.png`

export default ({ title, description, path }: { title: string, path: string, description: string }): WithContext<CollectionPage> => ({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": title,
    "url": url + path,
    "description": description,
    "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": url + path,
        "name": title,
        "description": description
    },
    "publisher": {
        "@type": "Organization",
        "name": name,
        "url": url,
        "logo": {
            "@type": "ImageObject",
            "url": banner,
            "width": { "@type": "QuantitativeValue", value: 1200 },
            "height": { "@type": "QuantitativeValue", value: 630 }
        },
        "sameAs": instagram
    }
})