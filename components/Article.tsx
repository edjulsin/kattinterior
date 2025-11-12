import { v7 as UUIDv7 } from 'uuid'
import type { Project } from '@/type/editor'
import Link from 'next/link'
import Image from 'next/image'
import { alt } from '@/utility/fn'
import fallback from '@/assets/fallback.svg'
import React from 'react'

const defaultThumbnail = {
    id: UUIDv7(),
    src: fallback,
    alt: 'Fallback thumbnail',
    width: 29,
    height: 29,
    thumbnail: false
}
const Article = ({ className, heading, project, index }: { heading: string, className?: string, project: Project, index: number }) => {
    const [thumbnail] = [
        ...project.assets.toSorted((a, b) =>
            Number(!a.thumbnail) - Number(!b.thumbnail)
        ),
        defaultThumbnail
    ]

    const title = React.createElement(
        heading,
        {
            className: 'font-serif text-center text-lg capitalize overflow-clip text-ellipsis whitespace-nowrap',
            style: { maxWidth: 'calc(100% - 48px - 8px - 12px)' }
        },
        project.name || 'Untitled'
    )
    return (
        <Link
            key={project.id}
            className={className}
            href={`/projects/${project.slug}`}
        >
            <article className='flex flex-col justify-center items-center gap-y-5'>
                <Image
                    className='w-full h-auto aspect-[65_/_90] max-w-2xs md:max-w-xs object-cover object-center'
                    src={thumbnail.src}
                    alt={alt(thumbnail.alt)}
                    width={thumbnail.width}
                    height={thumbnail.height}
                />
                <div className='flex justify-center items-center gap-x-3 w-full'>
                    <span className='text-center font-serif text-xs size-12 p-2 flex justify-center items-center flex-col rounded-full outline-1 outline-gold-900 text-gold-900'>
                        {(index + 1 < 10 ? '0' : '') + (index + 1)}
                    </span>
                    {title}
                </div>
            </article>
        </Link>
    )
}

export default Article