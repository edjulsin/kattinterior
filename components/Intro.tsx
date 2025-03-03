import Link from 'next/link';

export default () => (
    <section className='text-center max-w-md mx-auto'>
        <p className='text-lg/relaxed font-serif'>Katt Interior is a Bali-based studio dedicated to turning visions into spaces that resonate with the heart.</p>
        <br />
        <p className='text-lg/relaxed font-serif'>Our work is about crafting timeless spaces that leave a lasting impression.</p>
        <br />
        <br />
        <br />
        <p className='text-2xl font-sans font-medium'>Visit our <Link href='/services'><i className='underline'>services</i></Link> to see more about our solutions.</p>
    </section>
)