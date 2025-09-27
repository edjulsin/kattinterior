import type { MetadataRoute } from 'next'

const development = process.env.NODE_ENV === 'development'
const URL = development ? 'http://localhost:3000' : process.env.NEXT_PUBLIC_SITE_URL

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: [ '/dashboard', '/auth', '/preview', '/login', '/maintenance' ],
        },
        sitemap: `${URL}/sitemap.xml`
    }
}