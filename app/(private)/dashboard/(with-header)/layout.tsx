import Logo from '@/components/Logo';
import Link from 'next/link';
import Tabs from '@/components/Tabs';
import Account from '@/components/Account';
import { getUserInfo } from '@/action/server';

const DashboardLayout = ({ children }: Readonly<{ children: React.ReactNode }>) =>
    <div className='flex flex-col justify-center items-center size-full max-w-7xl gap-y-20 font-sans px-10 py-10'>
        <header className='flex flex-col justify-center items-center w-full'>
            <nav className='w-full flex justify-between items-center md:grid md:grid-cols-[1fr_3fr_1fr]'>
                <div className='hidden md:block md:justify-self-start'>
                    <Link href='/dashboard'>
                        <Logo className='max-h-9 size-full' />
                    </Link>
                </div>
                <div className='md:justify-self-center'>
                    <Tabs />
                </div>
                <div className='md:justify-self-end'>
                    {
                        getUserInfo().then(v =>
                            <Account {...v} />
                        )
                    }
                </div>
            </nav>
        </header>
        <main className='w-full'>
            {children}
        </main>
    </div>

export default DashboardLayout