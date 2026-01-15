import Image from 'next/image'
import first from '@/assets/1.jpg'
import second from '@/assets/2.jpg'
import third from '@/assets/3.jpg'

const Chaterina = () =>
    <section
        className='
            grid
            place-content-center
            place-items-center
            md:grid-cols-2
            md:grid-rows-[.5fr_.5fr_.5fr]
            md:gap-x-10
            xl:grid-cols-3
        '
    >
        <div className='parallax hidden md:block md:row-start-2 md:row-end-4 md:justify-self-end xl:justify-self-center'>
            <Image
                className='w-70 xl:w-80 h-auto aspect-60/80 object-center object-cover'
                src={first}
                alt='Chaterina Working in an Art Gallery'
            />
        </div>
        <div className='md:row-start-1 md:row-end-3 md:justify-self-start xl:justify-self-center'>
            <Image
                className='w-70 md:w-80 xl:w-90 h-auto aspect-60/90 object-left object-cover'
                src={second}
                alt='Chaterina find inspirations in an Arts Gallery'
            />
        </div>
        <div className='parallax hidden xl:block xl:col-start-3 xl:row-start-1 xl:row-end-4'>
            <Image
                className='w-60 h-auto aspect-60/80 object-center object-cover'
                src={third}
                alt='Chaterina Working with a Client'
            />
        </div>
    </section>

export default Chaterina
