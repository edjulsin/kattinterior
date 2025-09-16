import Link from 'next/link';

const Intro = () =>
    <section className='text-center max-w-2xs sm:max-w-sm md:max-w-md slide-from-bottom anim-delay-[150ms]'>
        <p className='text-base/loose sm:text-lg/loose font-serif'>Katt Interior is a Bali-based studio dedicated to turning visions into spaces that resonate with the heart.</p>
        <br />
        <p className='text-base/loose sm:text-lg/loose font-serif'>Our work is about crafting timeless spaces that leave a lasting impression.</p>
        <br />
        <br />
        <br />
        <p className='text-xl md:text-2xl font-sans font-medium'>Visit our <Link href='/services'><i className='underline'>services</i></Link> or <Link href='/projects'><i className='underline'>projects</i></Link> to see more.</p>
    </section>

export default Intro
