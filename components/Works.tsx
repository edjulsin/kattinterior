import Image from 'next/image';
import Link from 'next/link';

const works = [
    {
        alt: 'Villa Arunika',
        src: '/arunika/1.jpg',
        width: 1620,
        height: 1080,
        location: 'Nyanyi Beach, Bali'
    },
    {
        alt: 'Villa X',
        src: '/x/4.png',
        width: 1080,
        height: 1296,
        location: 'Kaba Kaba, Bali'
    }
]

// make it single projects so the theme/image's color will match instead of two different projects
// optional make link to see all projects
// should omit this if there are no featured project

export default () => (
    <section className='flex flex-col gap-y-20'>
        <h3 className='font-serif text-2xl text-gold-900 text-center'>LATEST WORKS</h3>
        <ul className='grid grid-cols-[1fr_.05fr_1fr] grid-rows-[1fr_.25fr]'>
            <li className='col-start-1 row-start-1 col-span-2 row-span-2 justify-self-end self-end z-20'>
                <Link href='/villa-arunika'>
                    <figure className='flex flex-col items-center gap-y-5'>
                        <Image
                            className='w-80 h-110 object-left object-cover'
                            alt='Villa Arunika'
                            src='/arunika/1.jpg'
                            width={ 1620 }
                            height={ 1080 }
                        />
                        <figcaption className='text-center'>
                            <h2 className='text-2xl/normal font-serif'>Villa Arunika</h2>
                            <span className='text-gold-900 font-sans font-semibold'>Nyanyi Beach, Bali</span>
                        </figcaption>
                    </figure>
                </Link>
            </li>
            <li className='col-start-2 row-start-1 col-span-2 justify-self-start z-10'>
                <Link href='/villa-x'>
                    <figure className='flex flex-col items-center gap-y-5'>
                        <Image
                            className='w-80 h-110 object-left object-cover'
                            alt='Villa X'
                            src='/x/4.png'
                            width={ 1080 }
                            height={ 1296 }
                        />
                        <figcaption className='text-center'>
                            <h2 className='text-2xl/normal font-serif'>Villa X</h2>
                            <span className='text-gold-900 font-sans font-semibold'>Kaba-Kaba, Bali</span>
                        </figcaption>
                    </figure>
                </Link>
            </li>
        </ul>
    </section>
)