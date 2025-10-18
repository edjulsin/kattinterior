import Link from 'next/link';

const Bottom = ({ copy }: { copy?: string }) =>
    <section className='text-center flex flex-col gap-y-10 max-w-2xs md:max-w-sm lg:max-w-md'>
        <h3 className='text-xl/loose lg:text-2xl/loose font-serif'>{ copy || 'Design your space with us' }</h3>
        <Link className='text-lg font-semibold font-sans text-amber-600' href='/contact'>Contact us &rarr;</Link>
    </section>

export default Bottom