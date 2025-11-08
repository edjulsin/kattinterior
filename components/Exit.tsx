'use client'

import { ExitIcon } from '@radix-ui/react-icons'

import { signOut } from '@/action/server'
import { useRouter } from 'next/navigation'
import clsx from 'clsx'
import { AccessibleIcon, DropdownMenu } from 'radix-ui'

const Logout = ({ className }: { className?: string }) => {
    const router = useRouter()
    const logout = () => signOut().then(
        () => { router.push('/login') },
        () => { router.push('/') }
    )
    const home = () => { router.push('/') }
    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger className={clsx(className, 'outline-1 rounded-lg flex justify-center items-center size-8 gap-x-1 transition-opacity outline-transparent opacity-50 hover:opacity-100 data-[state=open]:opacity-100 cursor-pointer')}>
                <AccessibleIcon.Root label='Menu'>
                    <ExitIcon />
                </AccessibleIcon.Root>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
                <DropdownMenu.Content
                    align='end'
                    sideOffset={10}
                    className='
                        text-sm 
                        font-semibold 
                        font-sans 
                        rounded-lg 
                        ring-1 
                        ring-neutral-200 
                        *:cursor-pointer 
                        p-1 
                        min-w-20 
                        *:data-highlighted:bg-amber-600
                        *:data-highlighted:text-light
                    '
                >
                    <DropdownMenu.Item
                        onSelect={home}
                        className='flex w-full items-center px-3 py-1.5 outline-transparent outline-1 rounded-lg'
                    >
                        Home
                    </DropdownMenu.Item>
                    <DropdownMenu.Item
                        onSelect={logout}
                        className='flex w-full items-center px-3 py-1.5 outline-transparent outline-1 rounded-lg'
                    >
                        Logout
                    </DropdownMenu.Item>
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    )
}

export default Logout

