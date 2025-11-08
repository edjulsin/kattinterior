import { getPublishedProjects } from '@/action/admin'
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
import { Metadata } from 'next'
import pageMeta from '@/meta/page'

export const dynamic = 'force-static'

const meta = {
    title: 'Services',
    description: 'Explore expert interior design services by Katt Interior Studio in Bali. We specialize in modern, functional, and aesthetic spaces tailored to your needs.',
    path: '/services'
}

export const metadata: Metadata = pageMeta(meta)

const Projects = async () => getPublishedProjects(0, 5).then(
    (projects: Project[]) => projects.length > 0
        ? <Gallery heading='h4'>

            {
                projects.map((v, i) =>
                    <Article
                        heading='h5'
                        key={v.id}
                        index={i}
                        project={v}
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

const ServicesPage = async () =>
    <Schema value={pageSchema(meta)}>
        <Intersector />
        <Parallax selectors={['.parallax']} />
        <section
            className='
                grid 
                grid-rows-[auto_auto_auto] 
                gap-y-10
                place-items-center 
                max-w-2xs
                md:max-w-sm
                xl:max-w-full
                xl:grid-rows-[auto_auto]
                xl:grid-cols-[auto_1fr]
                xl:*:first:row-span-2
                xl:place-items-start
                xl:gap-x-10
                xl:gap-y-0
                xl:*:self-end
            '
        >
            <Image
                className='rounded-tl-full rounded-tr-full w-full max-w-sm h-auto object-cover object-center'
                src={image1}
                width={1080}
                height={1350}
                alt='Chaterina working in Gallery'
            />
            <div className='flex flex-col justify-center items-center gap-y-5 lg:items-baseline'>
                <h1 className='font-serif text-base/loose md:text-lg/loose xl:text-xl/loose max-w-3xl slide-from-bottom anim-delay-[300ms]'>
                    Katt Interior is a Bali-based studio redefining spaces with timeless elegance.
                    We blend natural elements with thoughtful design to create environments that feel personal, inspiring, and unforgettable.
                </h1>
                <p className='font-sans max-w-md xl:max-w-lg text-base md:text-lg font-medium slide-from-bottom'>
                    We don’t chase a single signature style — because design should never be about us.
                    Each project is shaped by the people who live in it, their lifestyle, and their rhythm.
                    Through thoughtful design and natural materials, we create interiors that feel alive, timeless, and truly personal.
                </p>
            </div>
            <span className='font-serif text-4xl text-center text-amber-600'>&darr;</span>
        </section>
        <section className='max-w-2xs md:max-w-md xl:max-w-lg text-center flex flex-col justify-center items-center gap-y-5'>
            <h2 className='text-2xl md:text-3xl font-serif slide-from-bottom'>What we do</h2>
            <p className='font-sans text-base md:text-lg font-medium max-w-md slide-from-bottom anim-delay-[100ms]'>
                We design thoughtful, one-of-a-kind interiors — from boutique villas and wellness retreats to private residences and creative spaces.
                Whether it’s a full design transformation or styling consultation, we bring authenticity, artistry, and a touch of Bali into every detail.
            </p>
        </section>
        <div className='text-center max-w-2xs md:max-w-md xl:max-w-xl'>
            <p className='font-serif text-base/loose md:text-lg/loose xl:text-xl/loose slide-from-bottom anim-delay-[100ms]'>
                Every interior whispers a story — of comfort, character, and soul. When it feels like you, that’s when it feels like home.
            </p>
        </div>
        <section className='max-w-2xs md:max-w-md xl:max-w-full flex flex-col xl:flex-row gap-y-10 gap-x-10 justify-center items-center'>
            <div className='grid justify-center items-center place-items-center'>
                <div className='col-span-2 col-start-1 row-start-1 row-span-2'>
                    <Image
                        className='w-full aspect-[1_/_1.25] max-w-2xs hidden md:block object-cover object-center'
                        src={image2}
                        width={1080}
                        height={1440}
                        alt='Chaterina working in Gallery'
                    />
                </div>
                <div className='parallax w-full col-span-2 col-start-2 row-start-2 row-span-2 rounded-tl-full rounded-tr-full'>
                    <Image
                        className='z-10 aspect-[1_/_1.25] max-w-xs w-full object-cover object-center'
                        src={image3}
                        width={1440}
                        height={1080}
                        alt='Chaterina working in Gallery'
                    />
                </div>
            </div>
            <div className='flex flex-col justify-center gap-y-5 xl:max-w-md'>
                <h2 className='font-serif text-2xl md:text-3xl slide-from-bottom anim-delay-[100ms]'>How we work</h2>
                <p className='font-sans text-base md:text-lg font-medium slide-from-bottom'>
                    Every space begins with a story. At KATTINTERIOR, we listen—to your rituals, your rhythm, your roots.
                    From the first sketch to the final  detail, we design spaces that breathe with your personality—beautiful, functional, and deeply personal.
                </p>
                <Link className='text-lg md:text-xl font-sans font-medium text-amber-600' href='/services/packages'>Our packages &rarr;</Link>
            </div>
        </section>
        <section className='flex flex-col xl:flex-row-reverse gap-y-10 justify-center items-center gap-x-10 max-w-2xs md:max-w-md xl:max-w-full'>
            <Image
                className='w-full h-auto max-w-md object-cover object-center'
                src={image4}
                alt='Beautifull custom wall decoration by Chaterina.'
                width={1080}
                height={1350}
            />
            <div className='flex flex-col justify-center gap-y-5 font-sans font-medium xl:max-w-md'>
                <p className='text-base md:text-lg slide-from-bottom anim-delay-[100ms]'>
                    We bring your vision to life with thoughtful design, detailed 3D visuals, and refined material curation.
                    From concept to finishing touches, we guide every step with clarity and care — ensuring a seamless journey and a space hat feels effortless, personal, and beautifully crafted.
                    Your perfect space begins here.
                </p>
                <Link className='text-lg md:text-xl text-amber-600' href='/contact'>Contact us <span>&rarr;</span></Link>
            </div>
        </section>
        <section className='flex flex-col xl:flex-row items-center justify-center max-w-2xs md:max-w-sm xl:max-w-full xl:*:max-w-md text-center gap-x-35 gap-y-20'>
            <div className='flex flex-col gap-y-5'>
                <h3 className='text-xl md:text-2xl font-serif'>Residential design</h3>
                <p className='text-base md:text-lg font-sans font-medium'>
                    Home is where design becomes personal. We offer curated packages and custom design experiences to bring comfort, character, and calm to your space.
                </p>
                <p className='text-base md:text-lg font-sans font-medium'>
                    Let’s transform your space into your dream home together.
                </p>
            </div>
            <div className='flex flex-col gap-y-5'>
                <h3 className='text-xl md:text-2xl font-serif'>Commercial design</h3>
                <p className='text-base md:text-lg font-sans font-medium'>
                    For boutique hotels, cafés, restaurants, we create interiors that tell your brand’s story through thoughtful details and timeless warmth.
                </p>
                <p className='text-base md:text-lg font-sans font-medium'>
                    Pricing and scope are tailored to each project’s needs — reach out for a personalized proposal.
                </p>
            </div>
        </section>
        <Projects />
        <Bottom />
    </Schema>

export default ServicesPage