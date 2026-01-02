import Logo from '@/components/Logo';
import Link from 'next/link';
import Tabs from '@/components/Tabs';
import Account from '@/components/Account';
import { getUserInfo } from '@/action/server';

const DashboardLayout = ({ children }: Readonly<{ children: React.ReactNode }>) =>
    <div className='flex flex-col justify-center items-center size-full max-w-7xl gap-y-20 font-sans px-5'>
        <header className='flex flex-col justify-center items-center w-full h-28'>
            <nav className='w-full flex justify-between items-center *:basis-xs'>
                <Link href='/dashboard'>
                    <Logo className='max-h-9 size-full' />
                </Link>
                <Tabs />
                {
                    getUserInfo().then(v =>
                        <Account {...v} />
                    )
                }
            </nav>
        </header>
        <main className='w-full'>
            {children}
        </main>
    </div>

export default DashboardLayout