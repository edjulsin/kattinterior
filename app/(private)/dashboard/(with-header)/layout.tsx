import Exit from '@/components/Exit';
import Logo from '@/components/Logo';
import Link from 'next/link';
import Tabs from '@/components/Tabs';

const DashboardLayout = ({ children }: Readonly<{ children: React.ReactNode }>) =>
    <div className='flex flex-col justify-center items-center size-full max-w-7xl gap-y-20 font-sans px-5'>
        <header className='flex flex-col justify-center items-center size-full h-28'>
            <nav className='size-full grid grid-cols-[.25fr_1fr_.25fr] place-items-center'>
                <Link href='/dashboard'>
                    <Logo className='max-h-9 size-full' />
                </Link>
                <Tabs />
                <Exit />
            </nav>
        </header>
        <main className='w-full'>
            { children }
        </main>
    </div>

export default DashboardLayout