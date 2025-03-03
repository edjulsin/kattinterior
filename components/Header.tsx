import Link from 'next/link'

import Menu from './Menu'
import Logo from './Logo'


export default () => (
    <header className='sticky top-0 left-0 right-0 z-30 grid grid-cols-3 place-items-center h-28'>
        <Link href='/' className='col-start-2 h-9'>
            <Logo />
        </Link>
        <Menu />
    </header>
)