import Bottom from '@/components/Bottom';
import Image from 'next/image';
import image1 from '@/assets/7.jpg'
import image2 from '@/assets/2.jpg'
import pageSchema from '@/schemas/pageSchema';
import Schema from '@/components/Schema';
import Intersector from '@/components/Intersector';
import Parallax from '@/components/Parallax';

export const metadata = {
    title: 'About us',
    description: 'Learn about Katt Interior Studio — a Bali-based interior design studio specializing in residential and commercial spaces. Discover our story, design philosophy, and commitment to timeless, functional interiors.',
    alternates: {
        canonical: '/about'
    }
}

const AboutPage = () =>
    <Schema
        value={
            pageSchema({
                path: '/about',
                description: metadata.description as string
            })
        }
    >
        <Intersector />
        <Parallax selectors={ [ '.parallax' ] } />
        <section className='
            grid 
            gap-10
            justify-center 
            items-center
            max-w-2xs
            md:max-w-sm
            lg:max-w-full
            lg:grid-cols-[.45fr_1fr] 
            lg:grid-rows-[1fr_auto]
        '
        >
            <Image
                className='w-full h-auto object-cover object-center lg:row-span-2 max-w-sm unfold-y self-end anim-delay-100'
                src={ image1 }
                alt='Wall decoration by Chaterina'
                width={ 1080 }
                height={ 1350 }
                priority={ true }
            />
            <div className='flex flex-col gap-y-5'>
                <h1 className='text-xl/loose md:text-2xl/loose font-serif max-w-3xl full-slide-from-bottom anim-delay-[300ms]'>Luxury Interiors Rooted in Culture, Blending Tradition with Contemporary Style.</h1>
                <p className='font-sans text-base md:text-lg font-semibold max-w-md full-slide-from-bottom'>We specialize in crafting luxury residential and commercial interiors, tailored for private clients and developers seeking timeless elegance and exceptional design.</p>
            </div>
            <span className='block font-sans text-6xl text-center lg:text-left lg:self-end'>&darr;</span>
        </section>
        <section className='flex flex-col lg:flex-row-reverse lg:items-start gap-x-15 justify-center items-center gap-y-10 max-w-2xs md:max-w-sm lg:max-w-4xl'>
            <Image
                className='w-full h-100 md:h-120 lg:h-140 rounded-tl-full rounded-tr-full object-cover object-center'
                src={ image2 }
                alt='Chaterina in an Art Gallery'
                width={ 1080 }
                height={ 1350 }
            />
            <div className='max-w-sm'>
                <h4 className='text-xl/loose md:text-3xl/loose font-serif slide-from-bottom'>Inspired by earth – ignited by fire</h4>
                <br />
                <div className='flex flex-col gap-y-5 font-sans text-base font-semibold md:text-lg slide-from-bottom anim-delay-[100ms]'>
                    <p>Founded in 2018 by interior designer Chaterina Melissa, Katt Interior Studio is a Bali-based design atelier specializing in creating timeless and sophisticated spaces. </p>
                    <p>With years of experience designing high-end residential and commercial projects across Bali, Chaterina brings a deep understanding of aesthetics, functionality, and local craftsmanship.</p>
                    <p>At Katt interior studio, we believe every space tells a story. Our design philosophy blends modern elegance with Bali’s rich cultural heritage, crafting interiors that are not only visually stunning but also deeply connected to their surroundings. </p>
                    <p>Whether its a luxurious villa, a boutique resort, or a stylish café, we curate each project with passion, precision, and an unwavering commitment to excellence.</p>
                </div>
            </div>
        </section>
        <Bottom copy={ `Discover the art of living with ${process.env.NEXT_PUBLIC_SITE_NAME as string}` } />
    </Schema>

export default AboutPage

