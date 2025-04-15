import Link from 'next/link'
import NewPost from '@/public/newpost.svg'

export default () => (
    <section className='flex flex-col gap-y-5 justify-center items-center size-full h-[50dvh]'>
        <h1 className='text-2xl font-medium'>Start creating content</h1>
        <Link className='text-xl gap-x-2 font-bold flex justify-center items-center' role='button' href='/dashboard/editor/post'>
            <span><NewPost /></span>
            <span>Publish a post</span>
        </Link>
    </section>
)
