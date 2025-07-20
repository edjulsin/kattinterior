import contacts from '@/data/contacts'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'

export default () =>
    <section className='flex flex-col justify-center items-center gap-y-5'>
        <header>
            <div className='flex justify-center items-center bg-neutral-200 px-2 py-1 rounded-xl focus-within:outline-1 focus-within:outline-amber-600'>
                <MagnifyingGlassIcon className='text-neutral-500' />
                <input className='max-h-6 max-w-30 size-full p-3 font-semibold outline-transparent outline-1' placeholder='Find emails...' />
            </div>
        </header>
        <section className='py-15'>
            <table className='ring-1 ring-neutral-200 rounded-sm text-base'>
                <thead>
                    <tr className='border-b-1 border-b-neutral-200 text-neutral-500'>
                        <th className='py-3 px-8 text-left font-semibold uppercase' scope="col">Email</th>
                        <th className='py-3 px-8 text-left font-semibold' scope="col">
                            <button className='uppercase'>Last message</button>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        contacts.map(([ email, date ], i) =>
                            <tr className='text-base not-last:border-b-1 not-last:border-b-neutral-200' key={ i + email + date }>
                                <th className='py-3 px-8 text-left font-semibold' scope='row'>{ email }</th>
                                <td className='py-3 px-8 text-left font-medium text-neutral-500'>{ date }</td>
                            </tr>
                        )
                    }
                </tbody>
            </table>
        </section>
    </section>