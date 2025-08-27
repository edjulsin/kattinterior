import mask from '@/assets/mask.svg'
import poster from '@/assets/hero.png'

const Hero = () =>
    <section className='
        min-h-[83dvh] 
        grid
        place-items-center
        gap-y-10
        *:max-w-2xs
        sm:grid-cols-2
        sm:*:first:col-span-2
        sm:gap-x-15
        lg:grid-cols-3
        lg:*:first:col-span-1
        lg:*:first:cols-start-2
        lg:*:last:cols-start-3
        lg:*:nth-[2]:col-start-1
        lg:*:row-start-1
        lg:*:max-w-sm
    '
    >
        <div
            className='justify-self-center lg:max-w-md'
            style={ {
                maskImage: `url(${mask.src})`,
                maskRepeat: 'no-repeat',
                maskPosition: 'center center'
            } }
        >
            <video className='size-full object-contain object-center' poster={ poster.src } autoPlay loop playsInline muted disablePictureInPicture disableRemotePlayback>
                <source src='./hero.mp4' type='video/mp4' />
            </video>
        </div>
        <div className='flex flex-col gap-y-2 justify-center items-center text-center sm:text-right sm:justify-self-end lg:-translate-y-1/2 lg:gap-y-5 slide-from-right'>
            <h1 className='font-serif text-lg/loose md:text-xl/loose lg:text-2xl/relaxed xl:text-3xl/relaxed'>
                INTERIOR DESIGN{ ' ' }<span className='text-gold-900'>Specialist</span>
            </h1>
            <p className='font-sans font-semibold text-base lg:text-lg'>
                Katt is a Bali-based interior studio specializing in luxury residential and commercial interiors for private clients and developers.
            </p>
        </div>
        <div className='text-center sm:text-left sm:justify-self-start lg:translate-y-1/2'>
            <h1 className='font-serif text-lg/loose md:text-xl/loose lg:text-2xl/relaxed xl:text-3xl/relaxed slide-from-left anim-delay-[500ms]'>
                <span>PERSONALIZED{ ' ' }<span className='text-gold-900'>Interiors</span>{ ', ' }</span>
                <span>TIMELESS{ ' ' }<span className='text-gold-900'>Beauty</span></span>
            </h1>
        </div>
    </section>

export default Hero