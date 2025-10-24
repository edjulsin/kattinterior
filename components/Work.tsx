import { getFeaturedProject } from '@/action/admin';
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

const defaultImages = [thumbnail(), thumbnail()]

const Work = () => getFeaturedProject().then(
    (projects: Project[]) =>
        projects.map(v => {
            const asset = Object.fromEntries(
                v.assets.map(v => {
                    return [v.id, v]
                })
            )

            const images = [...v.template.desktop.items.slice(0, 2).map(v => asset[v.src]), ...defaultImages].slice(0, 2)

            return (
                <section key={v.id} className='flex flex-col gap-y-10 md:gap-y-15 xl:gap-y-20 justify-center items-center'>
                    <h3 className='font-serif text-gold-900 text-center text-xl/relaxed md:text-2xl/relaxed'>FEATURED WORK</h3>
                    <ul
                        className='
                            grid
                            sm:grid-cols-[.8fr_.2fr_.8fr]
                            sm:grid-rows-[.1fr_.9fr_.1fr]
                            sm:*:col-span-2
                            sm:*:row-span-2
                            sm:*:first:col-start-1
                            sm:*:last:col-start-2
                            sm:*:first:row-start-2
                            sm:*:last:row-start-1
                            sm:*:first:z-10
                        '
                    >
                        {
                            images.map((img, i) =>
                                <li key={img.id} className={clsx({ 'hidden sm:block': i === 1 })}>
                                    <Image // use sizes
                                        className='w-70 h-100 object-center object-cover sm:w-80 sm:h-110 lg:w-90 lg:h-120'
                                        alt={img.alt}
                                        src={img.src}
                                        width={img.width}
                                        height={img.height}
                                    />
                                </li>
                            )
                        }
                    </ul>
                    <div className='flex flex-col justify-center align-center text-center'>
                        <h2 className='text-xl/relaxed md:text-2xl/relaxed xl:text-3xl/relaxed font-serif capitalize'>{v.name}</h2>
                        <small className='text-gold-900 font-sans font-semibold capitalize text-base/relaxed md:text-lg/relaxed'>{v.location}</small>
                    </div>
                </section>
            )
        }),
    () => ([])
)

export default Work
