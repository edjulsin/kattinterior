import type { WebSite, WithContext } from 'schema-dts'

const development = process.env.NODE_ENV === 'development'
const url = development ? 'http://localhost:3000' : process.env.NEXT_PUBLIC_SITE_URL
const name = process.env.NEXT_PUBLIC_SITE_NAME
const banner = `${url}/banner.png`

export default ({ title, description, path }: { title: string, path: string, description: string }): WithContext<WebSite> => ({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "url": url,
    "name": name,
    "description": 'Discover professional interior design solutions in Bali with ${name}. Residential, commercial, and custom projects.',
    "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": url + path,
        "name": title,
        "description": description
    },
    "image": {
        "@type": "ImageObject",
        "url": banner,
        "width": { "@type": "QuantitativeValue", value: 1200 },
        "height": { "@type": "QuantitativeValue", value: 630 }
    }
})