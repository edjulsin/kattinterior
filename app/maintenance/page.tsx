import Schema from '@/components/Schema'
import pageSchema from '@/schemas/pageSchema'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Maintenance',
    description: `We are currently under maintenance. We should be back shortly. Thank you for your patience.`,
    alternates: {
        canonical: '/maintenance'
    }
}

const MaintenancePage = () =>
    <Schema
        value={
            pageSchema({
                path: metadata.alternates?.canonical as string,
                description: metadata.description as string
            })
        }
    >
        <div className='flex flex-col max-w-7xl size-full gap-y-10 justify-center items-center *:w-full'>
            <main className='flex flex-col gap-y-40 justify-center items-center *:w-full'>
                <section role='alert' className='h-[100dvh] w-full flex flex-col justify-center items-center gap-y-15 text-center max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-6xl font-medium'>
                    <h1 className='text-3xl/relaxed sm:text-6xl/relaxed md:text-7xl/relaxed lg:text-8xl/relaxed xl:text-9xl/relaxed font-serif'>Our site is under maintenance</h1>
                    <p className='font-sans text-lg/relaxed sm:text-xl/relaxed md:text-2xl/relaxed lg:text-3xl/relaxed xl:text-4xl/relaxed text-gold-950'>We should be back shortly. Thank you for your patience.</p>
                </section>
            </main>
        </div>
    </Schema>

export default MaintenancePage