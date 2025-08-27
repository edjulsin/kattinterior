'use client'

import { ExitIcon } from '@radix-ui/react-icons'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { AccessibleIcon } from '@radix-ui/react-accessible-icon'
import { signOut } from '@/action/server'
import { useRouter } from 'next/navigation'
import clsx from 'clsx'

const Logout = ({ className }: { className?: string }) => {
    const router = useRouter()
    const logout = () => signOut().then(
        () => { router.push('/login') },
        () => { router.push('/') }
    )
    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger className={ clsx(className, 'outline-1 rounded-lg flex justify-center items-center size-8 gap-x-1 outline-transparent hover:bg-neutral-200 data-[state=open]:bg-neutral-200 cursor-pointer') }>
                <AccessibleIcon label='Menu'>
                    <ExitIcon />
                </AccessibleIcon>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
                <DropdownMenu.Content
                    align='end'
                    sideOffset={ 10 }
                    className='text-sm font-semibold font-sans rounded-lg ring-1 ring-neutral-200 *:cursor-pointer p-1 min-w-25'
                >
                    <DropdownMenu.Item
                        onSelect={ logout }
                        className='flex w-full justify-center items-center px-2 py-1 outline-transparent outline-1 rounded-lg hover:bg-neutral-200'
                    >
                        Sign out
                    </DropdownMenu.Item>
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    )
}

export default Logout

