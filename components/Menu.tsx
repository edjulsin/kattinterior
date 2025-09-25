'use client'

import clsx from 'clsx'
import Link from 'next/link'
import Logo from './Logo'
import { useState } from 'react'
import Hamburger from './Hamburger'
import { VisuallyHidden, Dialog } from 'radix-ui'

const pages = [ 'projects', 'services', 'about', 'contact' ]

const Menu = () => {
    const [ state, setState ] = useState(false)
    const [ scrollable, setScrollable ] = useState(true)

    const onOpenChange = (state: boolean) => {
        setState(state)
        setScrollable(document.documentElement.scrollHeight > document.documentElement.clientHeight)
    }

    return (
        <Dialog.Root open={ state } onOpenChange={ onOpenChange }>
            <Dialog.Trigger asChild>
                <Hamburger />
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay
                    asChild
                    className={ clsx('fixed inset-0 z-50 group bg-dark data-[state=open]:fade-in data-[state=closed]:fade-out data-[state=closed]:anim-delay-[500ms]', { 'overflow-y-scroll': scrollable }) }
                >
                    <Dialog.Content>
                        <div className='grid size-full grid-rows-[auto_1fr_auto] text-white place-items-center max-w-7xl mx-auto gap-y-[5dvh]'>
                            <VisuallyHidden.Root>
                                <Dialog.Title>Navigation menu</Dialog.Title>
                                <Dialog.Description>Navigate all the pages in Katt Interior Design Website</Dialog.Description>
                            </VisuallyHidden.Root>
                            <div className='h-28 grid grid-cols-3 place-items-center size-full'>
                                <Dialog.Close asChild>
                                    <Link className='col-start-2 h-9' href='/'>
                                        <Logo />
                                    </Link>
                                </Dialog.Close>
                                <Dialog.Close data-state={ state ? 'open' : 'closed' } asChild>
                                    <Hamburger />
                                </Dialog.Close>
                            </div>
                            <nav className='self-start'>
                                <ul className='grid justify-center auto-rows-fr grid-cols-[.25fr_1fr] font-serif gap-y-5 lg:gap-y-8 hover:*:hover:opacity-100 hover:*:not-hover:opacity-50'>
                                    {
                                        pages.map((page, i) =>
                                            <li key={ page } className={ clsx('col-span-2 transition-opacity duration-350 ease-in-out overflow-clip', { 'col-start-2': i % 2 === 1 }) } >
                                                <Dialog.Close asChild>
                                                    <Link className='capitalize flex items-center gap-x-5' href={ `/${page}` }>
                                                        <span className='text-xs'>{ '0' + (i + 1) }</span>
                                                        <span
                                                            data-play={ state }
                                                            className='
                                                                text-3xl/relaxed
                                                                sm:text-4xl/relaxed 
                                                                md:text-5xl/relaxed 
                                                                lg:text-6xl/relaxed
                                                                origin-bottom-left
                                                                group-data-[state=open]:rotate-from-quarter
                                                                group-data-[state=closed]:rotate-to-quarter
                                                            '
                                                        >
                                                            { page }
                                                        </span>
                                                    </Link>
                                                </Dialog.Close>
                                            </li>
                                        )
                                    }
                                </ul>
                            </nav>
                            <Link target='_blank' className='font-sans text-md font-medium p-5' href={ process.env.NEXT_PUBLIC_INSTAGRAM_URL as string }>INSTAGRAM</Link>
                        </div>
                    </Dialog.Content>
                </Dialog.Overlay>
            </Dialog.Portal>
        </Dialog.Root>
    )
}

export default Menu

