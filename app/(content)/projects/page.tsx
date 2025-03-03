import Bottom from '@/components/Bottom'
import clsx from 'clsx'
import Image from 'next/image'

const images = [
    {
        alt: 'Villa X',
        source: '/x/4.png',
        width: 1080,
        height: 1296
    },
    {
        alt: 'Villa Arunika',
        source: '/arunika/1.jpg',
        width: 1620,
        height: 1080
    },
    {
        alt: 'Villa Asri',
        source: '/asri/4.png',
        width: 1620,
        height: 1080
    },
    {
        alt: 'Villa Harmonis',
        source: '/harmonis/14.jpg',
        width: 1280,
        height: 847
    },
    {
        alt: 'Villa Ubud',
        source: '/ubud/3.jpg',
        width: 1920,
        height: 1080
    }
]

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