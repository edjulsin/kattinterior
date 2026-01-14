import { getFeaturedProject } from '@/action/anon';
import { Project } from '@/type/editor';
import clsx from 'clsx';
import Image from 'next/image';
import { generateSizes, getThumbnails } from '@/utility/fn';

const Work = () => getFeaturedProject().then(
    (projects: Project[]) =>
        projects.map(v =>
            <section key={v.id} className='flex flex-col gap-y-10 md:gap-y-15 xl:gap-y-20 justify-center items-center'>
                <h3 className='font-sans font-semibold text-gold-900 text-center text-2xl/relaxed md:text-3xl/relaxed uppercase'>Featured work</h3>
                <ul
                    className='
                        grid
                        md:grid-cols-[.9fr_.1fr_.9fr]
                        md:grid-rows-[.1fr_.9fr_.1fr]
                        md:*:col-span-2
                        md:*:row-span-2
                        md:*:first:col-start-1
                        md:*:last:col-start-2
                        md:*:first:row-start-2
                        md:*:last:row-start-1
                        md:*:first:z-10
                    '
                >
                    {
                        getThumbnails(2, v).map((img, i) =>
                            <li key={img.id} className={clsx({ 'hidden md:block': i === 1 })}>
                                <Image
                                    className='w-70 md:w-80 xl:w-90 h-auto aspect-70/100 object-center object-cover'
                                    alt={img.alt}
                                    src={img.src}
                                    width={img.width}
                                    height={img.height}
                                    sizes={generateSizes(0.7, [280, 320, 360], img)}
                                />
                            </li>
                        )
                    }
                </ul>
                <div className='flex flex-col justify-center align-center text-center'>
                    <h4 className='text-xl/relaxed md:text-2xl/relaxed xl:text-3xl/relaxed font-serif capitalize'>{v.name}</h4>
                    <small className='text-gold-900 font-sans font-medium capitalize text-base/relaxed md:text-lg/relaxed'>{v.location}</small>
                </div>
            </section>
        ),
    () => ([])
)

export default Work
