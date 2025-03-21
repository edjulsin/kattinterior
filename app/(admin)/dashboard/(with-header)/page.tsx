import Link from 'next/link'
import NewPost from '@/public/newpost.svg'

export default () => (
    <section className='flex flex-col gap-y-10 justify-center items-center size-full h-[50dvh]'>
        <h1 className='text-3xl font-medium'>Start creating content</h1>
        <Link className='text-2xl font-semibold flex gap-x-2 justify-center items-center' role='button' href='/dashboard/editor/post'>
            <span><NewPost className='w-6' /></span>
            <span>Publish a post</span>
        </Link>
    </section>
)
