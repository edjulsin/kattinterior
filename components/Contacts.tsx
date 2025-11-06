'use client'

import { Contact } from '@/type/contact'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { useCallback, useState } from 'react'
import Message from './Message'
import Loader from './Loader'
import { getAllContacts, searchContacts } from '@/action/client'
import { debounce, formatISODate } from '@/utility/fn'

const Rows = ({ contacts }: { contacts: Contact[] }) => {
    const now = new Date()
    return contacts.map(({ name, email, updated_at }, i) =>
        <tr className='text-base not-last:border-b-1 not-last:border-b-neutral-200 text-nowrap *:px-8 *:py-3 *:text-left *:truncate' key={i + email}>
            <td className='w-[20%] font-medium opacity-50 capitalize hidden md:table-cell'>{name}</td>
            <td className='w-[40%] font-semibold'>
                <a className='text-amber-600 underline' href={`mailto:${email}`}>{email}</a>
            </td>
            <td className='w-[40%] font-medium opacity-50'>{formatISODate(now, updated_at)}</td>
        </tr>
    )
}

const Contacts = ({ fetchCount, contacts }: { fetchCount: number, contacts: Contact[] }) => {
    const [data, setData] = useState(contacts)
    const [loader, setLoader] = useState(contacts.length >= fetchCount)
    const [error, setError] = useState(false)
    const [search, setSearch] = useState('')
    const [result, setResult] = useState<Contact[]>([])

    const searchQuery = useCallback(debounce(1000, (search: string) =>
        searchContacts(0, fetchCount - 1, search).then(
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
    ), [])

    const onSearch = (search: string) => {
        setSearch(search)
        if(search) {
            setResult([])
            searchQuery(search)
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
                searchContacts(count, count + fetchCount, search).then(
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
                getAllContacts(count, count + fetchCount).then(
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
            v.name.toLowerCase().includes(terms) || v.email.toLowerCase().includes(terms)
        ).reduce<Contact[]>((a, b) => a.concat(
            a.some(v => v.id === b.id)
                ? ([])
                : ([b])
        ), [])
        : data

    return (
        <section className='flex flex-col justify-center items-center gap-y-5'>
            <header>
                <div className='flex justify-center items-center bg-light dark:bg-dark px-2 py-1 rounded-xl outline-1 outline-neutral-200 focus-within:outline-amber-600'>
                    <MagnifyingGlassIcon className='text-gold-900' />
                    <input
                        className='max-h-6 max-w-30 size-full p-2 font-semibold outline-transparent outline-1'
                        placeholder='Find emails...'
                        value={search}
                        onChange={e => onSearch(e.target.value)}
                    />
                </div>
            </header>
            <section className='py-15 w-[80%] flex flex-col justify-center items-center'>
                {
                    filtered.length > 0
                        ? <table className='ring-1 ring-neutral-200 rounded-sm text-base table-fixed w-full'>
                            <thead>
                                <tr className='border-b-1 border-b-neutral-200 opacity-50 text-nowrap *:px-8 *:py-3 *:text-left *:font-semibold *:uppercase'>
                                    <th className='w-[20%] hidden md:table-cell'>Name</th>
                                    <th className='w-[40%]'>Email</th>
                                    <th className='w-[40%]'>Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                <Rows contacts={filtered} />
                            </tbody>
                        </table>
                        : null
                }
                {filtered.length === 0 && (!loader) ? <Message message={'No contacts found'} /> : null}
                {error ? <Message message='Database error' /> : null}
                <Loader
                    key={data.length + result.length + search.length}
                    enabled={loader}
                    callback={onIntersecting}
                />
            </section>
        </section>
    )
}

export default Contacts