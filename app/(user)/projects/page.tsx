import Bottom from '@/components/Bottom'
import images from '@/data/projects'
import clsx from 'clsx'
import Image from 'next/image'

// make into list of articles
export default () => (
    <div className='flex flex-col gap-y-40 pt-[8dvh]'>
        <section className='flex flex-col gap-y-16'>
            <h1 className='text-center font-serif text-lg'>Design Stories</h1>
            <ul className='grid grid-cols-3 grid-flow-dense gap-y-20 place-items-center'>
                {

                    images.map((image, i) =>
                        <li
                            key={ i }
                            className={ clsx(
                                `row-span-3 col-start-${(i % 3) + 1}`,
                                { 'row-start-2': i === 1 }
                            ) }
                        >
                            <figure className='flex flex-col gap-y-5'>
                                <Image
                                    className='w-90 h-140 object-cover object-center'
                                    src={ image.source }
                                    alt={ image.alt }
                                    width={ image.width }
                                    height={ image.height }
                                />
                                <figcaption className='font-serif text-center text-lg'>{ image.alt }</figcaption>
                            </figure>
                        </li>
                    )
                }
            </ul>
        </section>
        <Bottom />
    </div>
)