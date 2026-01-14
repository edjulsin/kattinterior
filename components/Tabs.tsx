'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const Tabs = () => {
    const pathname = usePathname()
    return (
        <ul className='*:w-full *:capitalize *:text-center flex gap-x-5 md:gap-x-10 items-center justify-center text-base font-bold capitalize'>
            <Link
                className={pathname === '/dashboard/projects' ? 'opacity-100' : 'opacity-50'}
                href='/dashboard/projects'
            >
                projects
            </Link>
            <Link
                className={pathname === '/dashboard/contacts' ? 'opacity-100' : 'opacity-50'}
                href='/dashboard/contacts'
            >
                contacts
            </Link>
        </ul>
    )
}

export default Tabs