import Footer from '@/components/Footer'
import Header from '@/components/Header'
import ReactLenis from 'lenis/react'

const PublicLayout = ({ children }: Readonly<{ children: React.ReactNode }>) =>
    <div className='flex flex-col max-w-7xl size-full gap-y-10 justify-center items-center *:w-full'>
        <Header />
        <main className='flex flex-col gap-y-40 justify-center items-center *:w-full'>
            <ReactLenis root options={ { autoRaf: true } }>
                { children }
            </ReactLenis>
        </main>
        <Footer />
    </div>

export default PublicLayout