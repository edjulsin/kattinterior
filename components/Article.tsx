import { v7 as UUIDv7 } from 'uuid'
import type { Project } from '@/type/editor'
import Link from 'next/link'
import Image from 'next/image'
import { alt } from '@/utility/fn'

const defaultThumbnail = {
    id: UUIDv7(),
    src: '/fallback.svg',
    alt: 'Fallback thumbnail',
    width: 29,
    height: 29,
    thumbnail: false
}

export default ({ className, project }: { className?: string, project: Project }) => {
    const thumbnail = project.assets.length > 0
        ? project.assets.find(v => v.thumbnail) ?? project.assets[ 0 ]
        : defaultThumbnail

    return (
        <Link
            key={ project.id }
            className={ className }
            href={ `/projects/${project.slug}` }
        >
            <article className='flex flex-col gap-y-10' >
                <Image
                    className='w-95 h-135 object-cover object-center'
                    src={ thumbnail.src }
                    alt={ alt(thumbnail.alt) }
                    width={ thumbnail.width }
                    height={ thumbnail.height }
                />
                <h2 className='font-serif text-center text-lg capitalize'>{ project.name || 'Untitled' }</h2>
            </article>
        </Link>
    )
}