import Logo from '@/components/Logo';

const Loading = () =>
    <div className='w-dvw h-dvh bg-dark flex flex-col justify-center items-center full-slide-from-top'>
        <Logo className='w-auto h-10 text-light animate-pulse' />
    </div>

export default Loading