import { getPublishedProject } from '@/action/admin'
import { Photos, Project } from '@/type/editor'
import { isSlug } from 'validator'
import { ImageResponse } from 'next/og'
import Katt from '@/components/Katt'
import Banner from '@/components/Banner'
import { getThumbnails } from '@/utility/fn'

const size = { width: 1200, height: 630 }

const defaultOG = () => new ImageResponse(
    <div
        style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            height: '100%',
            backgroundColor: 'white'
        }}
    >
        <Banner />
    </div>,
    size
)

const projectOG = (images: Photos) => {
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
                        <img
                            key={v.id}
                            alt={v.alt}
                            src={v.src}
                            style={{ objectFit: 'cover', ...((i % 2) === 0 ? even : odd) }}
                        />
                    )
                }
            </div>
        </div>
        ,
        size
    )
}

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
            () => []
        )
    } else {
        return []
    }
}

const opengraph = async ({ params }: { params: Promise<{ slug: string }> }) =>
    params.then(v => {
        const slug = (v.slug + '').trim().toLowerCase()
        if(isSlug(slug)) {
            return getPublishedProject(slug).then(
                (v: Project[]) => {
                    const [result] = [
                        ...v.map(v => {
                            const [a, b, c] = getThumbnails(3, v)
                            return projectOG([b, a, c])
                        }),
                        defaultOG()
                    ]

                    return result
                },
                () => defaultOG()
            )
        } else {
            return defaultOG()
        }
    })

export default opengraph