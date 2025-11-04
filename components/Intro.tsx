import Link from 'next/link';

const Intro = () =>
    <section className='text-center max-w-2xs sm:max-w-sm md:max-w-md slide-from-bottom anim-delay-[150ms]'>
        <p className='text-lg md:text-2xl font-sans'>
            KATTINTERIOR is a Bali-based
            design studio turning visions into
            spaces that feel like you.
        </p>
        <br />
        <p className='text-lg md:text-2xl font-sans'>
            Guided by your story and fueled
            by our fire within, we create
            timeless interiors that speak to the
            heart.
        </p>
        <br />
        <br />
        <br />
        <p className='text-lg md:text-2xl font-medium font-sans'>Visit our <Link href='/services'><i className='underline'>services</i></Link> or <Link href='/projects'><i className='underline'>projects</i></Link> to see more.</p>
    </section>

export default Intro
