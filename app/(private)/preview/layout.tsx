import { isAuthorized } from '@/action/server';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { notFound } from 'next/navigation';

export default async ({ children }: Readonly<{ children: React.ReactNode }>) =>
    isAuthorized().then(
        () => (
            <div className='flex flex-col max-w-7xl size-full gap-y-10'>
                <Header />
                <main className='flex flex-col gap-y-40'>
                    { children }
                </main>
                <Footer />
            </div>
        ),
        () => { notFound() }
    )