import Link from 'next/link';

const Bottom = ({ copy }: { copy?: string }) =>
    <section className='text-center flex flex-col gap-y-5 max-w-2xs md:max-w-xs xl:max-w-sm'>
        <h3 className='text-base/loose md:text-lg/loose xl:text-xl/loose font-serif'>{copy || 'Design the life you’ve been imagining'}</h3>
        <Link className='text-lg font-semibold font-sans text-amber-600' href='/contact'>Contact us &rarr;</Link>
    </section>

export default Bottom