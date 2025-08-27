'use client'

import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const Tabs = ({ className }: { className?: string }) => {
    const pathname = usePathname()
    return (
        <ul className={ clsx(className, 'grid grid-cols-2 items-center justify-center text-base font-semibold text-neutral-400 capitalize') }>
            <Link
                className={ clsx('text-center px-8 py-2 w-full capitalize', { 'text-neutral-800': pathname === '/dashboard/projects' }) }
                href={ '/dashboard/projects' }
            >
                projects
            </Link>
            <Link
                className={ clsx('text-center px-8 py-2 w-full capitalize', { 'text-neutral-800': pathname === '/dashboard/contacts' }) }
                href={ '/dashboard/contacts' }
            >
                contacts
            </Link>
        </ul>
    )
}

export default Tabs