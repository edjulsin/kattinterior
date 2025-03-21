import Bottom from '@/components/Bottom'
import Image from 'next/image'
import Link from 'next/link'

export default () => (
    <div className='flex flex-col gap-y-40'>
        <section className='grid grid-cols-[1fr_2fr] grid-rows-[1fr_auto] gap-10'>
            <Image
                className='self-center justify-self-end rounded-tl-full rounded-tr-full h-140 w-120 col-start-1 row-span-2 object-cover object-center'
                src='/chaterina/1.jpg'
                width={ 1080 }
                height={ 1350 }
                alt='Chaterina working in Gallery'
            />
            <div className='self-center'>
                <h1 className='font-serif text-2xl/loose max-w-4xl'>
                    Katt Interior is a Bali-based studio redefining spaces with timeless elegance.
                    We blend natural elements with thoughtful design to create environments that feel personal, inspiring, and unforgettable.
                </h1>
                <br />
                <p className='font-sans max-w-md text-lg font-semibold'>
                    Designed for the bold and the visionary, our interiors spark conversation and leave a lasting impression.
                    With a seamless fusion of luxury and contemporary style, we craft distinctive spaces for both residential and commercial projects.
                </p>
            </div>
            <span className='font-serif col-start-2 text-4xl self-end'>&darr;</span>
        </section>
        <section className='text-center mx-auto max-w-lg'>
            <h2 className='text-2xl font-serif'>What we do</h2>
            <br />
            <p className='font-sans text-lg font-semibold max-w-md mx-auto'>
                We are an experienced interior design studio dedicated to creating unique, tailored spaces.
                Whether offering advice or full turn-key transformations—including art, decor, and furnishings—we bring originality to every project, from hotels and offices to mid-century homes.
            </p>
            <br />
            <br />
            <h2 className='font-serif text-2xl/relaxed '>Authentic spaces bring comfort and ease. Every interior tells a story—it’s a reflection of you.</h2>
        </section>
        <section className='grid grid-cols-2 place-items-center gap-x-10 '>
            <div className='grid grid-cols-[1fr_auto_auto] grid-rows-[1fr_1.5fr]'>
                <Image
                    className='w-120 h-140 object-cover object-center col-span-2 col-start-1 row-start-1 row-span-2'
                    src='/arunika/11.png'
                    width={ 1080 }
                    height={ 1440 }
                    alt='Chaterina working in Gallery'
                />
                <Image
                    className='w-70 h-90 object-cover object-center rounded-tl-full rounded-tr-full col-span-2 col-start-2 row-start-2 row-span-2'
                    src='/chaterina/3.jpg'
                    width={ 1440 }
                    height={ 1080 }
                    alt='Chaterina working in Gallery'
                />
            </div>
            <div>
                <h3 className='font-serif text-4xl'>How we work</h3>
                <br />
                <p className='font-sans text-lg font-semibold max-w-md'>
                    At Katt Interior Studio, we craft bespoke interiors with a meticulous, personalized approach.
                    From concept to execution, we design spaces that fit your lifestyle—considering everything from morning rituals to architectural history—ensuring your space not only looks beautiful but truly works for you.
                </p>
                <br />
                <Link className='text-xl font-sans font-semibold' href='/projects'>Our projects &rarr;</Link>
            </div>
        </section>
        <section className='flex justify-center items-center gap-x-20'>
            <div className='max-w-md font-sans text-lg font-semibold'>
                <p>
                    We bring your vision to life with detailed 3D designs and renders.
                    From concept to completion, we handle every step—design, permits, construction, and styling—ensuring a seamless process.
                    Your perfect space starts with us.
                </p>
                <br />
                <Link className='text-xl' href='/contact'>Contact us <span>&rarr;</span></Link>
            </div>
            <Image
                className='w-100 h-120 object-cover object-center'
                src='/asri/7.jpg'
                alt='Beautifull custom wall decoration by Chaterina.'
                width={ 1080 }
                height={ 1350 }
            />
        </section>
        <section className='flex justify-center items-start text-center gap-x-35'>
            <div className='max-w-sm'>
                <h1 className='text-3xl/relaxed font-serif'>Commercial design</h1>
                <br />
                <p className='text-lg font-sans font-semibold'>For commercial spaces—boutique B&Bs, hotels, offices, restaurants, and more—pricing is available upon request.</p>
                <br />
                <p className='text-lg font-sans font-semibold'>Reach out for a personalized quote—we’re flexible and ready to work with you!</p>
                <br />
                <Link href='/commercial-design' className='text-xl font-sans font-medium uppercase'>Read our code for commercial interiors</Link>
            </div>
            <div className='max-w-sm'>
                <h1 className='text-3xl/relaxed font-serif'>Residential design</h1>
                <br />
                <p className='text-lg font-sans font-semibold'>For residential spaces, we offer fixed-price packages. Need something unique? We can tailor a custom package to fit your vision.</p>
                <br />
                <p className='text-lg font-sans font-semibold'>Let’s transform your space into your dream home together.</p>
                <br />
                <Link href='/residential-design' className='font-sans text-xl font-medium uppercase'>See our residential packages</Link>
            </div>
        </section>
        <section className='flex flex-col place-items-center text-center gap-y-20 mx-auto'>
            <h5 className='text-2xl cols-start-1 col-span-2 font-medium font-serif'>Our latest works</h5>
            <ul className='flex flex-row gap-x-30'>
                <li>
                    <Link href='/villa-arunika'>
                        <figure className='flex flex-col gap-y-5'>
                            <Image
                                className='w-80 h-100 object-cover object-center'
                                src='/arunika/1.jpg'
                                width={ 1620 }
                                height={ 1080 }
                                alt='Villa Arunika by Katt Interior'
                            />
                            <figcaption className='text-lg font-serif'>Villa Arunika</figcaption>
                        </figure>
                    </Link>

                </li>
                <li>
                    <Link href='/villa-x'>
                        <figure className='flex flex-col gap-y-5'>
                            <Image
                                className='w-80 h-100 object-cover object-center'
                                src='/x/4.png'
                                width={ 1080 }
                                height={ 1296 }
                                alt='Villa X by Katt Interior'
                            />
                            <figcaption className='text-lg font-serif'>Villa X</figcaption>
                        </figure>
                    </Link>
                </li>
            </ul>
            <Link href='/projects' className='col-span-2 text-xl font-semibold font-sans'>All our projects <span>&rarr;</span></Link>
        </section>
        <Bottom />
    </div>
)