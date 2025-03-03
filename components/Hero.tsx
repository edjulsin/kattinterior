export default () => (
    <section className='grid grid-cols-3 grid-rows-2 gap-x-12 h-[85dvh] xl:h-[67dvh]'>
        <div className='col-[1] row-[1] justify-self-end self-end text-right'>
            <h1 className='font-serif text-3xl/relaxed'>
                INTERIOR DESIGN{ ' ' }<span className='text-neutral-500'>Specialist</span>
            </h1>
            <br />
            <p className='font-sans font-semibold text-lg max-w-sm'>
                Katt is a Bali-based interior studio specializing in luxury residential and commercial interiors for private clients and developers.
            </p>
        </div>
        <div
            className='row-span-2 self-center'
            style={ {
                maskImage: 'url(/hero/hero-clip.svg)',
                maskRepeat: 'no-repeat',
                maskPosition: 'center center'
            } }
        >
            <video className='size-full object-cover object-center' poster='/hero/image.png' autoPlay loop playsInline muted disablePictureInPicture disableRemotePlayback>
                <source src='/hero/video.mp4' type='video/mp4' />
            </video>
        </div>
        <div className='col-[3] row-[2]'>
            <h1 className='font-serif text-3xl/relaxed'>
                <span>PERSONALIZED{ ' ' }<span className='text-neutral-500'>Interiors</span>{ ', ' }</span>
                <span>TIMELESS{ ' ' }<span className='text-neutral-500'>Beauty</span></span>
            </h1>
        </div>
    </section >
)