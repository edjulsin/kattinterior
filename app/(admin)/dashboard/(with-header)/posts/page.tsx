import projects from '@/data/projects'
import Search from '@/public/search.svg'
import AngleDown from '@/public/angledown.svg'
import Link from 'next/link'
import Image from 'next/image'

export default () => (
    <section className='flex flex-col justify-center items-center gap-y-10 text-base'>
        <div className='grid grid-cols-[1fr_auto_1fr] place-items-center font-semibold size-full'>
            <div className='col-start-2 row-start-1 flex justify-center items-center bg-neutral-200 px-4 py-2 rounded-md'>
                <Search />
                <input className='max-h-5 max-w-30 size-full p-2 focus:outline-0' placeholder='Find posts...' />
            </div>
            <div className='col-start-3 justify-self-end flex justify-center items-center gap-x-5'>
                <div className='row-start-1 flex justify-center items-center'>
                    <span>All posts</span>
                    <AngleDown />
                </div>
                <div className='row-start-1 flex justify-center items-center'>
                    <span>Sort by: Newest</span>
                    <AngleDown />
                </div>
                <Link
                    className='row-start-1px-2 py-1 rounded-sm'
                    role='button'
                    href='/dashboard/editor/post'
                >
                    New post +
                </Link>
            </div>
        </div>
        <section className='py-14'>
            <ol className='grid grid-cols-4 place-items-center gap-15'>
                {
                    projects.map(project =>
                        <li key={ project.id }>
                            <Link href={ `/dashboard/editor/post/${project.id}` }>
                                <figure className='flex flex-col justify-center items-center gap-y-3'>
                                    <Image
                                        className='w-70 h-90 object-cover object-center'
                                        alt={ project.alt }
                                        src={ project.source }
                                        width={ project.width }
                                        height={ project.height }
                                    />
                                    <figcaption className='text-lg font-semibold'>{ project.alt }</figcaption>
                                </figure>
                            </Link>
                        </li>
                    )
                }
            </ol>
        </section>
    </section>
)