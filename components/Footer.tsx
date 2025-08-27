import Year from './Year'

const Footer = () =>
    <footer className='font-sans flex flex-col justify-center font-semibold text-center gap-y-5 h-[50dvh]'>
        <span className='text-lg md:text-xl full-slide-from-bottom anim-delay-[100ms]'>Somewhere in Bali</span>
        <Year />
    </footer>

export default Footer