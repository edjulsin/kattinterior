import Image from 'next/image'
import AngleDown from '@/public/angledown.svg'
import clsx from 'clsx'

export default ({ className = '' }: { className?: string }) => (
    <div className={ clsx(className, 'flex justify-center items-center gap-x-1') }>
        <Image className='size-[39px]' width={ 39 } height={ 39 } alt='user' src='/user.png' />
        <button className='size-4'>
            <AngleDown />
        </button>
    </div>
)