import { isAuthorized } from '@/action/server';
import { redirect } from 'next/navigation';

const DashboardRootLayout = async ({ children }: Readonly<{ children: React.ReactNode }>) =>
    isAuthorized().then(
        () => children,
        () => { redirect('/login') }
    )

export default DashboardRootLayout