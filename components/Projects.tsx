'use client'

import type { Project } from '@/type/editor'
import Link from 'next/link'
import Image from 'next/image'
import { MagnifyingGlassIcon, CaretDownIcon, PlusIcon } from '@radix-ui/react-icons'
import { useRouter } from 'next/navigation'
import { AccessibleIcon, DropdownMenu } from 'radix-ui'
import { useCallback, useState } from 'react'
import clsx from 'clsx'
import { createProject, getAllProjects, getDraftProjects, getFeaturedProjects, getNewestProjects, getOldestProjects, getPublishedProjects, getRecentProjects, searchProjects } from '@/action/client'
import { debounce, formatISODate, getThumbnails } from '@/utility/fn'
import Loader from './Loader'
import Message from './Message'

const filters = [
    'All',
    'Draft',
    'Published',
    'Featured',
    'Newest',
    'Oldest',
    'Recent'
]

const queries: Record<string, (start: number, end: number) => Promise<Project[]>> = {
    All: getAllProjects,
    Draft: getDraftProjects,
    Published: getPublishedProjects,
    Featured: getFeaturedProjects,
    Newest: getNewestProjects,
    Oldest: getOldestProjects,
    Recent: getRecentProjects
}

const Filter = ({ filter, onFilterChange, className }: { onFilterChange: (filter: string) => void, filter: string, className?: string }) =>
    <DropdownMenu.Root>
        <DropdownMenu.Trigger className={clsx('flex justify-between items-center gap-x-1 group font-sans font-semibold rounded-lg cursor-pointer', className)}>
            <span>{filter}</span>
            <span>
                <AccessibleIcon.Root label='Filter posts'>
                    <CaretDownIcon className='transition-transform duration-200 group-data-[state=open]:rotate-180' />
                </AccessibleIcon.Root>
            </span>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
            <DropdownMenu.Content
                align='end'
                sideOffset={5}
                asChild
            >
                <DropdownMenu.RadioGroup
                    value={filter || 'All'}
                    onValueChange={filter => onFilterChange(filter)}
                    className='
                        flex 
                        flex-col 
                        items-center 
                        justify-center 
                        gap-y-0.5
                        min-w-max
                        font-sans 
                        font-semibold 
                        text-sm 
                        z-50 
                        bg-light 
                        dark:bg-dark
                        ring-1
                        ring-neutral-200 
                        rounded-sm
                        p-1
                        *:rounded-sm
                        *:size-full
                        *:select-none
                        *:outline-transparent
                        *:data-highlighted:bg-amber-600
                        *:data-highlighted:text-light
                    '
                >
                    {
                        filters.map(name =>
                            <DropdownMenu.RadioItem
                                key={name}
                                className={
                                    clsx(
                                        'px-3 py-1.5 flex w-full justify center items-center cursor-pointer outline-transparent outline-1',
                                        { 'bg-amber-600 text-light': filter === name }
                                    )
                                }
                                value={name}
                            >
                                {name}
                            </DropdownMenu.RadioItem>
                        )
                    }
                </DropdownMenu.RadioGroup>
            </DropdownMenu.Content>
        </DropdownMenu.Portal>
    </DropdownMenu.Root>


const List = ({ projects }: { projects: Project[] }) => {
    const now = new Date()
    return (
        <ol className='grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 place-items-center gap-15'>
            {
                projects.map((project, i) => {
                    const [thumbnail] = getThumbnails(1, project)
                    const time = formatISODate(now, project.created_at)
                    return (
                        <li key={project.id}>
                            <Link href={`/dashboard/editor/${project.id}`}>
                                <figure className='flex flex-col justify-center items-center gap-y-3'>
                                    <div className='relative bg-neutral-200'>
                                        <Image
                                            className='w-70 h-90 object-cover object-center'
                                            src={thumbnail.src}
                                            width={thumbnail.width}
                                            height={thumbnail.height}
                                            alt={thumbnail.alt}
                                            priority={i === 0}
                                        />
                                        {
                                            project.featured
                                                ? (
                                                    <small className='text-light/80 text-sm absolute top-0 right-0 px-2 py-1 backdrop-blur-xl bg-neutral-600/50 capitalize'>
                                                        featured
                                                    </small>
                                                )
                                                : null
                                        }
                                        <div className='backdrop-blur-xl bg-neutral-600/50 w-full px-2 py-1 absolute bottom-0 left-0 flex justify-between items-center text-sm'>
                                            <time className='text-light/70'>{time}</time>
                                            <small className='uppercase text-light/70 font-medium'>{project.published ? 'published' : 'draft'}</small>
                                        </div>
                                    </div>
                                    <figcaption className='text-xl max-w-1/2 overflow-hidden text-ellipsis whitespace-nowrap text-center font-medium'>{project.name || '(Untitled)'}</figcaption>
                                </figure>
                            </Link>
                        </li>
                    )
                })
            }
        </ol>
    )
}

const Projects = ({ fetchCount, projects }: { fetchCount: number, projects: Project[] }) => {
    const [data, setData] = useState(projects)
    const [filter, setFilter] = useState('All')
    const [loader, setLoader] = useState(projects.length >= fetchCount)
    const [error, setError] = useState(false)
    const [search, setSearch] = useState('')
    const [result, setResult] = useState<Project[]>([])

    const action = () => createProject().then(
        id => { router.push('/dashboard/editor/' + id) },
        () => {
            setError(true)
            setLoader(false)
        }
    )

    const router = useRouter()

    const onFilterChange = (filter: string) => {
        setFilter(filter)
        setLoader(false)
        queries[filter](0, fetchCount - 1).then(
            v => {
                setData(v)
                setLoader(v.length >= fetchCount)
                setError(false)
            },
            () => {
                setError(true)
                setLoader(false)
            }
        )
    }

    const searchQuery = useCallback(debounce(1000, (search: string[]) => {
        searchProjects(0, fetchCount - 1, search).then(
            v => {
                setResult(v)
                setLoader(v.length >= fetchCount)
                setError(false)
            },
            () => {
                setResult([])
                setLoader(false)
                setError(true)
            }
        )
    }), [])

    const onSearch = (search: string) => {
        setSearch(search)
        if(search) {
            setResult([])
            searchQuery(
                search.trim().split(' ')
            )
        } else {
            setLoader((data.length % fetchCount) === 0)
            setResult([])
        }
    }

    const onIntersecting = (entries: IntersectionObserverEntry[]) => {
        const intersects = entries.filter(v => v.isIntersecting)

        if(search) {
            const count = result.length
            const values = (count === 0 || count % fetchCount) ? ([]) : intersects

            values.forEach(() =>
                searchProjects(count, count + fetchCount, search.trim().split(' ')).then(
                    v => {
                        setLoader(v.length >= fetchCount)
                        setResult(result =>
                            result.concat(v)
                        )
                        setError(false)
                    },
                    () => {
                        setError(true)
                        setLoader(false)
                    }
                )
            )
        } else {
            const count = data.length
            const values = (count === 0 || count % fetchCount) ? ([]) : intersects

            values.forEach(() =>
                (queries[filter])(count, count + fetchCount).then(
                    v => {
                        setLoader(v.length >= fetchCount)
                        setData(data =>
                            data.concat(v)
                        )
                        setError(false)
                    },
                    () => {
                        setError(true)
                        setLoader(false)
                    }
                )
            )
        }
    }

    const terms = search.trim().toLocaleLowerCase()

    const filtered = terms
        ? ([...data, ...result]).filter(v =>
            v.name.toLowerCase().includes(terms)
        ).reduce<Project[]>((a, b) => a.concat(
            a.some(v => v.id === b.id)
                ? ([])
                : ([b])
        ), [])
        : data

    return (
        <section className='w-full flex flex-col justify-center items-center text-base'>
            <div className='z-50 sticky top-0 py-10 rounded-lg grid grid-cols-2 md:grid-cols-3 font-semibold size-full items-center justify-between text-sm md:text-base *:px-3 *:py-1.5'>
                <button
                    className='flex bg-light dark:bg-dark outline-neutral-200 outline-1 justify-center items-center gap-x-1 cursor-pointer rounded-lg justify-self-start group hover:bg-amber-600 hover:text-light'
                    onClick={action}
                >
                    <span>New Project</span>
                    <span><PlusIcon /></span>
                </button>
                <div className='flex justify-center items-center bg-light dark:bg-dark rounded-xl justify-self-end md:justify-self-center outline-1 outline-neutral-200 focus-within:outline-amber-600 transition-colors'>
                    <MagnifyingGlassIcon className='text-gold-900' />
                    <input value={search} onChange={e => onSearch(e.target.value)} className='max-h-6 max-w-30 size-full p-2 outline-1 outline-transparent' placeholder='Find projects...' />
                </div>
                <Filter filter={filter} onFilterChange={onFilterChange} className='hidden md:flex bg-light dark:bg-dark justify-self-end outline-1 outline-neutral-200 hover:bg-amber-600 hover:text-light' />
            </div>
            <section className='py-15 flex flex-col justify-center items-center gap-y-5'>
                <List projects={filtered} />
                {filtered.length === 0 && (!loader) ? <Message message={'No projects found'} /> : null}
                {error ? <Message message='Database error' /> : null}
                <Loader
                    key={(filter + search).length + result.length + data.length}
                    enabled={loader}
                    callback={onIntersecting}
                />
            </section>
        </section>
    )
}

export default Projects
