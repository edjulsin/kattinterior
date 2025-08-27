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

const Article = ({ className, project, index }: { className?: string, project: Project, index: number }) => {
    const thumbnail = project.assets.length > 0
        ? project.assets.find(v => v.thumbnail) ?? project.assets[ 0 ]
        : defaultThumbnail

    return (
        <Link
            key={ project.id }
            className={ className }
            href={ `/projects/${project.slug}` }
        >
            <article className='flex flex-col gap-y-5 lg:gap-y-15 xl:gap-y-20' >
                <Image
                    className='w-65 h-90 lg:scale-115 xl:scale-130 object-cover object-center'
                    src={ thumbnail.src }
                    alt={ alt(thumbnail.alt) }
                    width={ thumbnail.width }
                    height={ thumbnail.height }
                />
                <div className='flex justify-center items-center gap-x-5'>
                    <span className='text-center font-serif text-xs size-12 p-2 flex justify-center items-center flex-col rounded-full outline-1'>{ (index + 1 < 10 ? '0' : '') + (index + 1) }</span>
                    <h2 className='font-serif text-center text-lg capitalize'>{ project.name || 'Untitled' }</h2>
                </div>
            </article>
        </Link>
    )
}

export default Article