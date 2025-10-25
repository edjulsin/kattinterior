import mask from '@/assets/mask.svg'
import poster from '@/assets/hero.png'

const Hero = () =>
    <section className='
        grid
        justify-center
        w-full
        items-center
        gap-y-15
        *:max-w-2xs
        md:grid-cols-2
        md:*:first:col-span-2
        md:grid-rows-[1fr_.5fr]
        md:gap-y-0
        md:gap-x-20
        xl:grid-rows-1
        xl:grid-cols-[1fr_.8fr_1fr]
        xl:*:first:col-span-1
        xl:*:first:cols-start-2
        xl:*:last:cols-start-3
        xl:*:nth-[2]:col-start-1
        xl:*:row-start-1
        xl:*:max-w-sm
    '
        style={{ minHeight: 'calc(100dvh - 152px)' }}
    >
        <div className='justify-self-center w-full h-auto relative overflow-clip flex flex-col justify-center items-center' style={{ aspectRatio: '300 / 465' }}>
            <video
                preload='auto'
                className='w-full h-auto object-contain object-center absolute'
                style={{
                    maskImage: `url(${mask.src})`,
                    maskRepeat: 'no-repeat',
                    maskPosition: 'center center',
                    aspectRatio: '400 / 650'
                }}
                poster={poster.src}
                autoPlay={true}
                loop={true}
                playsInline={true}
                muted={true}
                disablePictureInPicture={true}
                disableRemotePlayback={true}
            >
                <source src='./hero.mp4' type='video/mp4' />
            </video>
        </div>
        <div className='flex flex-col gap-y-5 justify-center items-center text-center md:self-baseline md:text-right md:justify-self-end xl:self-center xl:-translate-y-1/2 xl:gap-y-5 slide-from-right'>
            <h1 className='font-serif text-lg/relaxed md:text-xl/relaxed xl:text-3xl/relaxed'>
                INTERIOR DESIGN{' '}<span className='text-gold-900'>Specialist</span>
            </h1>
            <p className='font-sans font-semibold text-base md:text-lg'>
                Katt is a Bali-based interior studio specializing in luxury residential and commercial interiors for private clients and developers.
            </p>
        </div>
        <div className='text-center md:text-left md:justify-self-start md:self-baseline md:translate-y-1/2 xl:self-center'>
            <h2 className='font-serif text-lg/relaxed md:text-xl/relaxed xl:text-3xl/relaxed slide-from-left anim-delay-[500ms]'>
                <span>PERSONALIZED{' '}<span className='text-gold-900'>Interiors</span>{', '}</span>
                <span>TIMELESS{' '}<span className='text-gold-900'>Beauty</span></span>
            </h2>
        </div>
    </section>

export default Hero