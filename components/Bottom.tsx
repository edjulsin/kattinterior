import Link from 'next/link';

export default ({ copy }: { copy?: string }) => (
    <section className='text-center max-w-md mx-auto'>
        <h3 className='text-3xl/loose font-serif'>{ copy || 'Get in touch' }</h3>
        <br />
        <Link className='text-lg font-semibold font-sans text-amber-600' href='/contact'>Contact us &rarr;</Link>
    </section>
)