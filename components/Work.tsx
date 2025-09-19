import { getFeaturedProject } from '@/action/server';
import { Project } from '@/type/editor';
import clsx from 'clsx';
import Image from 'next/image';
import { v7 as UUIDv7 } from 'uuid'
import fallback from '@/assets/fallback.svg'

const thumbnail = () => ({
    id: UUIDv7(),
    src: fallback,
    alt: 'Fallback thumbnail',
    width: 29,
    height: 29,
    thumbnail: false
})

const defaultImages = [ thumbnail(), thumbnail() ]

const Work = () => getFeaturedProject().then(
    (projects: Project[]) =>
        projects.map(v => {
            const asset = Object.fromEntries(
                v.assets.map(v => {
                    return [ v.id, v ]
                })
            )

            const images = [ ...v.template.desktop.items.slice(0, 2).map(v => asset[ v.src ]), ...defaultImages ].slice(0, 2)

            return (
                <section key={ v.id } className='flex flex-col gap-y-20 justify-center items-center'>
                    <h3 className='font-serif text-gold-900 text-center text-xl/relaxed lg:text-2xl/relaxed'>LATEST WORK</h3>
                    <ul
                        className='
                            grid
                            grid-cols-1
                            sm:grid-cols-[.80fr_.20fr_.80fr]
                            sm:grid-rows-[.2fr_.8fr]
                            sm:*:col-span-2
                            sm:*:nth-[1]:col-start-1
                            sm:*:nth-[2]:col-start-2
                            sm:*:nth-[1]:row-start-2
                            sm:*:nth-[2]:row-start-1
                            sm:*:nth-[2]:row-span-2
                            sm:*:first:z-10
                        '
                    >
                        {
                            images.map((img, i) =>
                                <li key={ img.id } className={ clsx({ 'hidden sm:block': i === 1 }, { 'block': i === 0 }) }>
                                    <Image // use sizes
                                        className={ clsx('w-70 h-100 object-center object-cover sm:w-80 sm:h-110 lg:w-90 lg:h-120') }
                                        alt={ img.alt }
                                        src={ img.src }
                                        width={ img.width }
                                        height={ img.height }
                                    />
                                </li>
                            )
                        }
                    </ul>
                    <div className='flex flex-col justify-center align-center text-center'>
                        <h2 className='text-2xl/normal font-serif capitalize'>{ v.name }</h2>
                        <small className='text-gold-900 font-sans font-semibold capitalize text-lg'>{ v.location }</small>
                    </div>
                </section>
            )
        }),
    () => ([])
)

export default Work
