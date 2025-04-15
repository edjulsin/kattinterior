import contacts from '@/data/contacts'
import Search from '@/public/search.svg'

export default () => (
    <section className='flex flex-col justify-center items-center'>
        <header>
            <div className='flex justify-center items-center gap-x-2 bg-neutral-200 px-4 py-2 rounded-md'>
                <Search />
                <input className='max-h-5 max-w-30 size-full p-2 font-semibold focus:outline-0' placeholder='Find emails...' />
            </div>
        </header>
        <section className='py-14'>
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
                                <td className='py-3 px-8 text-left font-medium'>{ date }</td>
                            </tr>
                        )
                    }
                </tbody>
            </table>

        </section>
    </section>
)