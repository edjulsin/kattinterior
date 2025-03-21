'use client'

export default ({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) => (
    <section role='alert' className='h-[100dvh] w-full flex flex-col justify-center items-center gap-y-10 max-w-6xl mx-auto font-medium'>
        <h1 className='text-center text-9xl/relaxed font-serif'>Something went wrong!</h1>
        <button className='text-3xl/relaxed font-sans cursor-pointer' onClick={ () => reset() }>Try again</button>
    </section>
)