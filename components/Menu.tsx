'use client'

import clsx from 'clsx'
import Link from 'next/link'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { Close, Content, Description, Portal, Root, Title, Trigger, Overlay } from '@radix-ui/react-dialog'
import { AccessibleIcon } from '@radix-ui/react-accessible-icon'
import Logo from './Logo'
import { useState } from 'react'
import Hamburger from './Hamburger'
const pages = ['projects', 'services', 'packages', 'about', 'contact']

export default ({ className = '' }: { className?: string }) => {
    const [state, setState] = useState('')
    const [scrollable, setScrollable] = useState(true)

    const onOpenChange = () => {
        setState(state => state === '' || state === 'close' ? 'open' : 'close')
        setScrollable(document.documentElement.scrollHeight > document.documentElement.clientHeight)
    }

    return (
        <Root onOpenChange={ onOpenChange }>
            <Trigger asChild>
                <Hamburger className={ className } state={ state } />
            </Trigger>
            <Portal>
                <Overlay asChild>
                    <Content className={ clsx('fixed inset-0 bg-[#6E3931] z-50 group size-full', { 'overflow-y-scroll': scrollable }) }>
                        <div className='grid size-full grid-rows-[auto_1fr_auto] text-white place-items-center max-w-7xl mx-auto gap-y-[5dvh]'>
                            <VisuallyHidden>
                                <Title>Navigation menu</Title>
                                <Description>Navigate all the pages in Katt Interior Design Website</Description>
                            </VisuallyHidden>
                            <div className='h-28 grid grid-cols-3 place-items-center size-full'>
                                <Close asChild>
                                    <Link className='col-start-2 h-9' href='/'>
                                        <Logo />
                                    </Link>
                                </Close>
                                <Close asChild>
                                    <Hamburger state={ state } />
                                </Close>
                            </div>
                            <nav className='self-start'>
                                <ul className='grid grid-rows-5 grid-cols-[.25fr_1fr] font-serif gap-y-15'>
                                    {
                                        pages.map((page, i) =>
                                            <Close key={ page } asChild>
                                                <Link className={ clsx('col-span-2', { 'col-start-2': i % 2 === 1 }) } href={ `/${page}` }>
                                                    <li className='capitalize flex flex-row items-center gap-x-10'>
                                                        <span className='text-xs'>{ '0' + (i + 1) }</span>
                                                        <span className='text-6xl'>{ page }</span>
                                                    </li>
                                                </Link>
                                            </Close>
                                        )
                                    }
                                </ul>
                            </nav>
                            <Link target='_blank' className='font-sans text-md font-medium p-5' href='https://www.instagram.com/kattinterior/'>INSTAGRAM</Link>
                        </div>
                    </Content>
                </Overlay>
            </Portal>
        </Root>
    )
}

