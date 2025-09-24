import Year from './Year'

const Footer = () =>
    <footer className='font-sans flex flex-col justify-center font-semibold text-center gap-y-10 h-[50dvh]'>
        <span className='text-lg md:text-xl'>Somewhere in Bali</span>
        <Year />
        <span className='text-base md:text-lg text-gold-950 font-medium'>Indonesia</span>
    </footer>

export default Footer