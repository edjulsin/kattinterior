import { CrossCircledIcon } from '@radix-ui/react-icons'

const Error = ({ title }: { title: string }) =>
    <section className='w-full text-center h-[30dvh] flex flex-col justify-center items-center gap-y-2'>
        <span className='flex items-center justify-center gap-x-1'>
            <CrossCircledIcon className='text-neutral-500' />
            <h3 className='text-xl font-bold capitalize'>{ title }</h3>
        </span>
        <br />
        <p className='text-base font-semibold text-neutral-500'>Contact the administrator for support.</p>
    </section>


export default Error