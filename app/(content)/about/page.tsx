import Bottom from '@/components/Bottom';
import Image from 'next/image';

export default () => (
    <div className='flex flex-col gap-y-50'>
        <section className='grid grid-cols-[1fr_2fr] grid-rows-[auto_auto] gap-10'>
            <Image
                className='w-100 h-140 row-span-2 justify-self-end object-cover object-center'
                src='/asri/7.jpg'
                alt='Wall decoration by Chaterina'
                width={ 1080 }
                height={ 1350 }
            />
            <div className='self-end'>
                <h1 className='text-4xl/loose font-serif'>Luxury Interiors Rooted in Culture, Blending Tradition with Contemporary Style.</h1>
                <br />
                <p className='font-sans text-lg font-semibold max-w-md'>We specialize in crafting luxury residential and commercial interiors, tailored for private clients and developers seeking timeless elegance and exceptional design.</p>
            </div>
            <span className='font-sans text-6xl self-end'>&darr;</span>
        </section>
        <section className='grid grid-cols-2 gap-x-10'>
            <div className='justify-self-end'>
                <h4 className='text-4xl/relaxed font-serif max-w-md'>Inspired by earth – ignited by fire</h4>
                <br />
                <p className='max-w-sm font-sans text-lg font-semibold'>Founded in 2018 by interior designer Chaterina Melissa, Katt Interior Studio is a Bali-based design atelier specializing in creating timeless and sophisticated spaces. </p>
                <br />
                <p className='max-w-sm font-sans text-lg font-semibold'>With years of experience designing high-end residential and commercial projects across Bali, Chaterina brings a deep understanding of aesthetics, functionality, and local craftsmanship.</p>
                <br />
                <p className='max-w-sm font-sans text-lg font-semibold'>At Katt interior studio, we believe every space tells a story. Our design philosophy blends modern elegance with Bali’s rich cultural heritage, crafting interiors that are not only visually stunning but also deeply connected to their surroundings. </p>
                <br />
                <p className='max-w-sm font-sans text-lg font-semibold'>Whether it's a luxurious villa, a boutique resort, or a stylish café, we curate each project with passion, precision, and an unwavering commitment to excellence.</p>
            </div>
            <Image
                className='w-120 h-150 rounded-tl-full rounded-tr-full self-center object-cover object-center'
                src='/chaterina/2.jpg'
                alt='Chaterina in an Art Gallery'
                width={ 1080 }
                height={ 1350 }
            />
        </section>
        <Bottom copy='Discover the art of living with Katt Interior Studio' />
    </div>
)