import Link from 'next/link'

import Menu from './Menu'
import Logo from './Logo'
import Theme from './Theme'


export default () => (
    <header className='sticky top-0 left-0 right-0 z-50 grid grid-cols-3 place-items-center h-28'>
        <Theme />
        <Link href='/' className='col-start-2 h-9'>
            <Logo />
        </Link>
        <Menu />
    </header>
)