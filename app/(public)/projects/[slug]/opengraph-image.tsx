import { getPublishedProject } from '@/action/server'
import { getAllPublishedProjects } from '@/action/admin'
import { Project } from '@/type/editor'
import { isSlug } from 'validator'
import { ImageResponse } from 'next/og'
import Katt from '@/components/Katt'
import Banner from '@/components/Banner'

const size = { width: 1200, height: 630 }

const defaultOG = () => new ImageResponse(
    <div style={{ width: '100%', height: '100%', backgroundColor: 'white' }}>
        <Banner />
    </div>,
    size
)

export const dynamic = 'force-static'

export const generateStaticParams = async () =>
    getAllPublishedProjects().then(
        v => v.map((v: Project) => {
            return { slug: v.slug }
        }),
        () => ([])
    )

export const generateImageMetadata = async ({ params }: { params: { slug: string } }) => {
    const slug = (params.slug + '').trim().toLowerCase()
    if(isSlug(slug)) {
        return getPublishedProject(slug).then(
            v => v.map((v: Project) => {
                return {
                    id: v.id,
                    size: size,
                    alt: v.name,
                    contentType: 'image/png'
                }
            }),
            () => ([])
        )
    } else {
        return []
    }
}

const Opengraph = async ({ params }: { params: { slug: string } }) => {
    const slug = (params.slug + '').trim().toLowerCase()
    if(isSlug(slug)) {
        return getPublishedProject(slug).then(
            (v: Project[]) => {
                const result = v.map(v => {
                    const table = Object.fromEntries(
                        v.assets.map(v => {
                            return [v.id, v]
                        })
                    )
                    const images = v.template.desktop.items.slice(0, 3).map(v => table[v.src])
                    const even = { width: '25%', height: '65%' }
                    const odd = { width: '30%', height: '90%' }
                    return new ImageResponse(
                        <div
                            style={{
                                height: '100%',
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '20px',
                                padding: '35px',
                                backgroundColor: 'white'
                            }}
                        >
                            <Katt style={{ width: '12%', height: '12%' }} />
                            <div style={{ display: 'flex', width: '100%', height: '88%', justifyContent: 'center', alignItems: 'center', gap: '50px' }}>
                                {
                                    images.map((v, i) =>
                                        <img alt={v.alt} key={v.id} src={v.src} style={{ objectFit: 'cover', ...((i % 2) === 0 ? even : odd) }} />
                                    )
                                }
                            </div>
                        </div>
                        ,
                        size
                    )
                })
                if(result.length > 0) {
                    const [response] = result
                    return response
                } else {
                    return defaultOG()
                }
            },
            () => defaultOG()
        )
    } else {
        return defaultOG()
    }
}

export default Opengraph