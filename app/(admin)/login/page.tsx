import Logo from '@/components/Logo';
import { AccessibleIcon } from '@radix-ui/react-accessible-icon';
import Google from '@/public/google.svg'

export default () => (
    <section className='h-[65dvh] w-full flex flex-col justify-center items-center gap-y-5'>
        <span className='p-5'>
            <Logo className='max-h-9 size-full' />
        </span>
        <button className='flex items-center justify-center gap-x-3 w-max px-4 py-2 ring-1 ring-neutral-200 rounded-md'>
            <span className='font-sans font-medium text-lg'>Continue with Google</span>
            <span className='w-5'>
                <AccessibleIcon label='Continue with Google'>
                    <Google className='size-full' />
                </AccessibleIcon>
            </span>
        </button>
    </section>
)