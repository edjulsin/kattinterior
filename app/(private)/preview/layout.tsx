import { authorize } from '@/action/server';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import ReactLenis from 'lenis/react';
import { notFound } from 'next/navigation';

const PreviewLayout = async ({ children }: Readonly<{ children: React.ReactNode }>) =>
    authorize().then(
        () =>
            <div className='flex flex-col max-w-7xl size-full gap-y-10'>
                <Header />
                <main className='flex flex-col justify-center items-center gap-y-40'>
                    <ReactLenis root options={{ autoRaf: true }}>
                        {children}
                    </ReactLenis>
                </main>
                <Footer />
            </div>
        ,
        () => { notFound() }
    )

export default PreviewLayout