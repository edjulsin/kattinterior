import { isAuthorized } from '@/action/server';
import { redirect } from 'next/navigation';

export default async ({ children }: Readonly<{ children: React.ReactNode }>) =>
    isAuthorized().then(
        () => children,
        () => { redirect('/login') }
    )