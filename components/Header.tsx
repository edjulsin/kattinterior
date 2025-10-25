import Link from 'next/link'
import Menu from './Menu'
import Logo from './Logo'
import Theme from './Theme'
import Adaptive from './Adaptive'

const Header = () =>
    <header className='sticky top-0 left-0 right-0 z-50 grid grid-cols-3 place-items-center h-28 pointer-events-none *:pointer-events-auto'>
        <Theme />
        <Link href='/' className='col-start-2 h-9'>
            <Adaptive>
                <Logo />
            </Adaptive>
        </Link>
        <Menu />
    </header>

export default Header
