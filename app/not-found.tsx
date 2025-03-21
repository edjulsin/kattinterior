import Link from 'next/link';

export default () => (
    <section role='alert' className='h-[100dvh] w-full flex flex-col justify-center items-center gap-y-10 text-center max-w-6xl mx-auto font-medium'>
        <h1 className='text-9xl/relaxed font-serif'>Oops, that page is gone!</h1>
        <p className='font-sans text-3xl/relaxed text-neutral-500'>The page you’re looking for doesn’t exist or has been moved.</p>
        <Link className='font-sans text-3xl/relaxed' href='/'>Back home &rarr;</Link>
    </section>
)