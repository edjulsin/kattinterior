import projects from '@/data/projects'
import Search from '@/public/search.svg'
import AngleDown from '@/public/angledown.svg'
import Link from 'next/link'
import Image from 'next/image'

export default () => (
    <section className='flex flex-col justify-center items-center gap-y-15'>
        <div className='grid grid-cols-[1fr_auto_1fr] place-items-center font-semibold size-full'>
            <div className='col-start-2 row-start-1 flex justify-center items-center gap-x-2 bg-neutral-100 px-4 py-2 rounded-sm'>
                <Search className='w-3' />
                <input className='max-h-5 max-w-30 size-full p-2' placeholder='Find posts...' />
            </div>
            <div className='col-start-3 justify-self-end flex justify-center items-center gap-x-5'>
                <div className='row-start-1 flex justify-center items-center gap-x-2'>
                    <span>All posts</span>
                    <AngleDown className='w-3' />
                </div>
                <div className='row-start-1 flex justify-center items-center gap-x-2'>
                    <span>Sort by: Newest</span>
                    <AngleDown className='w-3' />
                </div>
                <Link
                    className='row-start-1 ring-1 ring-neutral-200 px-2 py-1 rounded-xs'
                    role='button'
                    href='/dashboard/editor/post'
                >
                    New post +
                </Link>
            </div>
        </div>
        <section>
            <ol className='grid grid-cols-4 place-items-center gap-15'>
                {
                    projects.map(project =>
                        <Link key={ project.id } href={ `/dashboard/editor/post/${project.id}` }>
                            <figure className='flex flex-col justify-center items-center gap-y-3'>
                                <Image
                                    className='w-70 h-90 object-cover object-center'
                                    alt={ project.alt }
                                    src={ project.source }
                                    width={ project.width }
                                    height={ project.height }
                                />
                                <figcaption className='text-xl font-medium'>{ project.alt }</figcaption>
                            </figure>
                        </Link>
                    )
                }
            </ol>
        </section>
    </section>
)