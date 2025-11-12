import Bottom from '@/components/Bottom';
import Image from 'next/image';
import image1 from '@/assets/7.jpg'
import image2 from '@/assets/2.jpg'
import pageSchema from '@/schemas/pageSchema';
import Schema from '@/components/Schema';
import Intersector from '@/components/Intersector';
import Parallax from '@/components/Parallax';
import pageMeta from '@/meta/page';

const name = process.env.NEXT_PUBLIC_SITE_NAME as string
const meta = {
    title: 'About',
    description: 'Learn about Katt Interior Studio — a Bali-based interior design studio specializing in residential and commercial spaces. Discover our story, design philosophy, and commitment to timeless, functional interiors.',
    path: '/about'
}

export const metadata = pageMeta(meta)

const AboutPage = () =>
    <Schema value={pageSchema(meta)}>
        <Intersector />
        <Parallax selectors={['.parallax']} />
        <section className='
            grid 
            gap-10
            justify-center 
            items-center
            max-w-2xs
            md:max-w-sm
            xl:max-w-full
            xl:grid-cols-[.4fr_1fr] 
            xl:grid-rows-[1fr_auto]
        '
        >
            <Image
                className='w-full h-auto max-w-sm aspect-[1_/_1.35] object-cover object-center xl:row-span-2 unfold-y justify-self-center self-end anim-delay-100'
                src={image1}
                alt='Wall decoration by Chaterina'
                width={1080}
                height={1350}
                priority={true}
            />
            <div className='flex flex-col justify-center gap-y-5'>
                <h1 className='text-lg/relaxed md:text-xl/relaxed xl:text-2xl/relaxed font-serif max-w-3xl full-slide-from-bottom anim-delay-[300ms]'>
                    Timeless design rooted in culture, crafted for modern living.
                </h1>
                <p className='font-sans text-base md:text-lg font-medium max-w-lg full-slide-from-bottom'>
                    We craft soulful interiors that honor local culture while embracing modern living.
                    Each project — from private residences to boutique commercial spaces — is tailored for clients and developers seeking timeless elegance, natural warmth, and meaningful design.
                </p>
            </div>
            <span className='block font-sans text-6xl text-center xl:text-left xl:self-end text-amber-600'>&darr;</span>
        </section>
        <section className='flex flex-col xl:flex-row-reverse xl:items-start gap-y-10 justify-center items-center max-w-2xs md:max-w-sm xl:max-w-full'>
            <Image
                className='w-full h-auto aspect-[1_/_1.45] max-w-md rounded-tl-full rounded-tr-full object-cover object-center'
                src={image2}
                alt='Chaterina in an Art Gallery'
                width={1080}
                height={1350}
            />
            <div className='flex flex-col justify-center gap-y-5'>
                <h2 className='text-xl/relaxed md:text-2xl/relaxed xl:text-3xl/relaxed font-serif slide-from-bottom max-w-lg'>
                    Guided by your story, ignited by our fire within.
                </h2>
                <div className='max-w-sm flex flex-col gap-y-5 justify-center font-sans text-base font-medium md:text-lg slide-from-bottom anim-delay-[100ms]'>
                    <p>
                        Founded in 2018 by interior designer Chaterina Melissa, KATTINTERIOR is a Bali-
                        based design atelier dedicated to creating timeless and soulful spaces —
                        shaped around the people who live in them.
                    </p>
                    <p>
                        With years of experience designing residential and commercial projects across
                        Bali, Chaterina brings a deep understanding of aesthetics, functionality, and
                        local craftsmanship.
                    </p>
                    <p>
                        At KATTINTERIOR, we believe every home should tell your story — not ours.
                        We don’t impose a fixed signature style, because this isn’t our home; it’s yours.
                        Our role is to listen, interpret, and translate your lifestyle and personality into
                        design — creating spaces that feel genuinely personal, comfortable, and true to
                        who you are.
                    </p>
                    <p>
                        Blending modern refinement with Bali’s cultural richness, we craft interiors that
                        balance calm beauty with purpose.
                    </p>
                    <p>
                        Whether it’s a luxurious villa, a boutique resort, or a small private retreat, every
                        project is approached with passion, precision, and an unwavering respect for
                        individuality.
                    </p>
                </div>
            </div>
        </section>
        <Bottom copy={`Discover the art of living with ${name}`} />
    </Schema>

export default AboutPage

