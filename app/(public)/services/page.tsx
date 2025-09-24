import { getPublishedProjects } from '@/action/server'
import Bottom from '@/components/Bottom'
import { Project } from '@/type/editor'
import Image from 'next/image'
import Link from 'next/link'
import image1 from '@/assets/1.jpg'
import image2 from '@/assets/6.png'
import image3 from '@/assets/3.jpg'
import image4 from '@/assets/7.jpg'
import pageSchema from '@/schemas/pageSchema'
import Schema from '@/components/Schema'
import Gallery from '@/components/Gallery'
import Article from '@/components/Article'
import Intersector from '@/components/Intersector'
import Parallax from '@/components/Parallax'

const Projects = async () => getPublishedProjects(0, 5).then(
    (projects: Project[]) => projects.length > 0
        ? <Gallery title='Design Stories'>
            {
                projects.map((v, i) =>
                    <Article
                        key={ v.id }
                        index={ i }
                        project={ v }
                    />
                )
            }
            <div className='text center font-semibold font-sans text-gold-950 text-lg'>
                <Link href='/projects'>All our projects &rarr;</Link>
            </div>
        </Gallery>
        : ([])
    ,
    () => ([])
)


export const metadata = {
    title: 'Services',
    description: 'Explore expert interior design services by Katt Interior Studio in Bali. We specialize in modern, functional, and aesthetic spaces tailored to your needs.',
    alternates: {
        canonical: '/services'
    }
}

const ServicesPage = async () =>
    <Schema
        value={
            pageSchema({
                path: '/services',
                description: metadata.description as string
            })
        }
    >
        <Intersector />
        <Parallax selectors={ [ '.parallax' ] } />
        <section
            className='
                grid 
                grid-rows-[auto_auto_auto] 
                gap-y-15
                place-items-center 
                max-w-2xs
                sm:max-w-sm
                lg:max-w-full
                lg:grid-rows-[auto_auto]
                lg:grid-cols-[auto_1fr]
                lg:*:first:row-span-2
                lg:place-items-start
                lg:gap-x-10
                lg:gap-y-0
                lg:*:self-end
            '
        >
            <Image
                className='rounded-tl-full rounded-tr-full w-full max-w-sm h-auto object-cover object-center'
                src={ image1 }
                width={ 1080 }
                height={ 1350 }
                alt='Chaterina working in Gallery'
            />
            <div className='flex flex-col justify-center items-center gap-y-10 lg:items-baseline'>
                <h1 className='font-serif text-sm/loose sm:text-base/loose lg:text-xl/loose max-w-3xl slide-from-bottom anim-delay-[300ms]'>
                    Katt Interior is a Bali-based studio redefining spaces with timeless elegance.
                    We blend natural elements with thoughtful design to create environments that feel personal, inspiring, and unforgettable.
                </h1>
                <p className='font-sans max-w-md text-base sm:text-lg font-semibold slide-from-bottom'>
                    Designed for the bold and the visionary, our interiors spark conversation and leave a lasting impression.
                    With a seamless fusion of luxury and contemporary style, we craft distinctive spaces for both residential and commercial projects.
                </p>
            </div>
            <span className='font-serif text-4xl text-center'>&darr;</span>
        </section>
        <section className='max-w-2xs sm:max-w-sm md:max-w-md lg:max-w-lg text-center flex flex-col justify-center items-center gap-y-10'>
            <h2 className='text-2xl sm:text-3xl font-serif slide-from-bottom'>What we do</h2>
            <p className='font-sans text-base sm:text-lg font-semibold max-w-md slide-from-bottom anim-delay-[100ms]'>
                We are an experienced interior design studio dedicated to creating unique, tailored spaces.
                Whether offering advice or full turn-key transformations—including art, decor, and furnishings—we bring originality to every project, from hotels and offices to mid-century homes.
            </p>
        </section>
        <section className='text-center max-w-2xs sm:max-w-md'>
            <h4 className='font-serif text-base/loose sm:text-lg/loose md:text-xl/loose slide-from-bottom anim-delay-[100ms]'>Authentic spaces bring comfort and ease. Every interior tells a story—it’s a reflection of you.</h4>
        </section>
        <section className='max-w-2xs sm:max-w-sm md:max-w-md lg:max-w-full flex flex-col lg:flex-row gap-y-15 gap-x-10 justify-center items-center'>
            <div className='grid justify-center items-center'>
                <div className='col-span-2 col-start-1 row-start-1 row-span-2'>
                    <Image
                        className='w-full h-100 hidden sm:block md:h-120 object-cover object-center'
                        src={ image2 }
                        width={ 1080 }
                        height={ 1440 }
                        alt='Chaterina working in Gallery'
                    />
                </div>
                <div className='parallax w-full col-span-2 col-start-2 row-start-2 row-span-2 rounded-tl-full rounded-tr-full'>
                    <Image
                        className='z-10 w-full h-90 sm:w-55 sm:h-70 md:h-90 md:w-70 object-cover object-center'
                        src={ image3 }
                        width={ 1440 }
                        height={ 1080 }
                        alt='Chaterina working in Gallery'
                    />
                </div>
            </div>
            <div className='lg:max-w-md'>
                <h3 className='font-serif text-2xl sm:text-3xl slide-from-bottom anim-delay-[100ms]'>How we work</h3>
                <br />
                <p className='font-sans text-base sm:text-lg font-semibold slide-from-bottom'>
                    At Katt Interior Studio, we craft bespoke interiors with a meticulous, personalized approach.
                    From concept to execution, we design spaces that fit your lifestyle—considering everything from morning rituals to architectural history—ensuring your space not only looks beautiful but truly works for you.
                </p>
                <br />
                <br />
                <Link className='text-xl font-sans font-semibold text-amber-600' href='/projects'>Our projects &rarr;</Link>
            </div>
        </section>
        <section className='flex flex-col lg:flex-row-reverse gap-y-15 justify-center items-center gap-x-10 max-w-2xs sm:max-w-sm md:max-w-md lg:max-w-full'>
            <Image
                className='w-full h-auto max-w-md object-cover object-center'
                src={ image4 }
                alt='Beautifull custom wall decoration by Chaterina.'
                width={ 1080 }
                height={ 1350 }
            />
            <div className='font-sans font-semibold lg:max-w-md'>
                <p className='text-base sm:text-lg slide-from-bottom anim-delay-[100ms]'>
                    We bring your vision to life with detailed 3D designs and renders.
                    From concept to completion, we handle every step—design, permits, construction, and styling—ensuring a seamless process.
                    Your perfect space starts with us.
                </p>
                <br />
                <br />
                <Link className='text-xl text-amber-600' href='/contact'>Contact us <span>&rarr;</span></Link>
            </div>
        </section>
        <section className='flex flex-col lg:flex-row justify-center items-center max-w-2xs sm:max-w-sm lg:max-w-full lg:*:max-w-md text-center gap-x-35 gap-y-20'>
            <div>
                <h1 className='text-xl/relaxed sm:text-2xl font-serif'>Commercial design</h1>
                <br />
                <p className='text-base sm:text-lg font-sans font-semibold'>For commercial spaces—boutique B&Bs, hotels, offices, restaurants, and more—pricing is available upon request.</p>
                <br />
                <p className='text-base sm:text-lg font-sans font-semibold'>Reach out for a personalized quote—we’re flexible and ready to work with you!</p>
                <br />
                <br />
                <Link href='/services/commercial-design' className='text-base font-sans font-semibold uppercase text-gold-950'>Read our code for commercial interiors</Link>
            </div>
            <div>
                <h1 className='text-xl/relaxed sm:text-2xl font-serif'>Residential design</h1>
                <br />
                <p className='text-base sm:text-lg font-sans font-semibold'>For residential spaces, we offer fixed-price packages. Need something unique? We can tailor a custom package to fit your vision.</p>
                <br />
                <p className='text-base sm:text-lg font-sans font-semibold'>Let’s transform your space into your dream home together.</p>
                <br />
                <br />
                <Link href='/services/residential-design' className='font-sans text-base font-semibold uppercase text-gold-950'>See our residential packages</Link>
            </div>
        </section>
        <Projects />
        <Bottom />
    </Schema>

export default ServicesPage