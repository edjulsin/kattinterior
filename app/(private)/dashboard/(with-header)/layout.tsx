import Logout from '@/components/Logout';
import Logo from '@/components/Logo';
import Link from 'next/link';
import Tabs from '@/components/Tabs';

export default ({ children }: Readonly<{ children: React.ReactNode }>) =>
    <div className='flex flex-col justify-center items-center size-full max-w-7xl gap-y-20 font-sans px-5'>
        <header className='flex flex-col justify-center items-center size-full h-28'>
            <nav className='size-full grid grid-cols-3 place-items-center gap-x-20'>
                <Link href='/dashboard'>
                    <Logo className='max-h-9 size-full' />
                </Link>
                <Tabs />
                <Logout />
            </nav>
        </header>
        <main className='w-full'>
            { children }
        </main>
    </div>