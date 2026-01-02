import { authorize } from '@/action/server';
import { redirect } from 'next/navigation';

const DashboardLayout = async ({ children }: Readonly<{ children: React.ReactNode }>) =>
    authorize().then(
        () => children,
        () => { redirect('/login') }
    )

export default DashboardLayout