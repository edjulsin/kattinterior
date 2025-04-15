'use client'

import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const tabs = [
    [ 'home', '/dashboard' ],
    [ 'posts', '/dashboard/posts', ],
    [ 'contacts', '/dashboard/contacts' ]
]

export default () => {
    const pathname = usePathname()
    return (
        <ul className='flex items-center justify-center gap-x-15 text-lg font-semibold text-neutral-500 capitalize'>
            {
                tabs.map(([ name, href ]) =>
                    <Link key={ name } className={ clsx({ 'text-black underline': pathname === href }) } href={ href }>{ name }</Link>
                )
            }
        </ul>
    )
}