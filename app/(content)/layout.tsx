import Footer from '@/components/Footer'
import Header from '@/components/Header'

export default ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => (
    <div className='flex flex-col max-w-7xl mx-auto gap-y-10'>
        <Header />
        <main className='flex flex-col gap-y-40'>
            { children }
        </main>
        <Footer />
    </div>
)