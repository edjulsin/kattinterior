import Image from 'next/image'
import first from '@/assets/1.jpg'
import second from '@/assets/2.jpg'
import third from '@/assets/3.jpg'

const Chaterina = () =>
    <section className='
        grid 
        grid-cols-1
        place-items-center
        sm:grid-cols-[1fr_.2fr_1fr]
        sm:grid-rows-[1fr_.2fr_1fr]
        lg:grid-cols-[1fr_.2fr_1fr_1fr]
    '
    >
        <div className='parallax hidden sm:justify-self-end sm:z-10 sm:self-start sm:block sm:row-span-2 sm:col-span-2 sm:row-start-2 sm:col-start-1'>
            <Image
                className='w-70 h-90 lg:w-80 lg:h-100 object-center object-cover '
                src={ first }
                alt='Chaterina Working in an Art Gallery'
                width={ 1080 }
                height={ 1350 }
            />
        </div>
        <div className='sm:place-self-start sm:row-start-1 sm:col-start-2 sm:row-span-2 sm:col-span-2'>
            <Image
                className='w-70 h-100 sm:w-80 sm:h-110 md:w-90 md:h-120 object-left object-cover'
                src={ second }
                alt='Chaterina find inspirations in an Arts Gallery'
                width={ 1080 }
                height={ 1350 }
            />
        </div>
        <div className='parallax hidden lg:block justify-self-start col-start-4 row-span-3'>
            <Image
                className='w-60 h-80 object-center object-cover'
                src={ third }
                alt='Chaterina Working with a Client'
                width={ 1440 }
                height={ 1080 }
            />
        </div>
    </section>

export default Chaterina
