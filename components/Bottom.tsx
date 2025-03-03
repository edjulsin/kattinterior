import Link from 'next/link';

export default ({ copy }: { copy?: string }) => (
    <section className='text-center max-w-md mx-auto'>
        <h3 className='text-3xl/loose font-serif'>{ copy || 'Get in touch' }</h3>
        <br />
        <Link className='text-xl font-semibold lowercase font-sans' href='/contact'>contact us &rarr;</Link>
    </section>
)