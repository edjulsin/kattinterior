import User from '@/components/User';
import Logo from '@/components/Logo';
import Link from 'next/link';
import Tabs from '@/components/Tabs';

export default ({ children }: Readonly<{ children: React.ReactNode }>) => (
    <div className='flex flex-col justify-center items-center max-w-7xl mx-auto gap-y-10 font-sans'>
        <header className='flex flex-col justify-center items-center size-full h-28'>
            <nav className='size-full grid grid-cols-[1fr_3fr_1fr] place-items-center gap-x-20'>
                <Link href='/dashboard'>
                    <Logo className='max-h-9 size-full' />
                </Link>
                <Tabs />
                <User />
            </nav>
        </header>
        <main>
            { children }
        </main>
    </div>
)