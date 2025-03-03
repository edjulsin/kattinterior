import Link from 'next/link';

export default () => (
    <section role='alert' className='h-[80dvh] w-full flex flex-col justify-center items-center gap-y-5 font-sans max-w-4xl mx-auto'>
        <h1 className='text-center text-8xl/loose font-serif font-medium'>Oops, that page is gone!</h1>
        <p className='text-2xl font-semibold text-neutral-500'>The page you’re looking for doesn’t exist or has been moved.</p>
        <Link className='text-2xl font-semibold' href='/'>Back home &rarr;</Link>
    </section>
)