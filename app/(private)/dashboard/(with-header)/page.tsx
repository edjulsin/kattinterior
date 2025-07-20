'use client'

import { createProject } from '@/action/client'
import Error from '@/components/Error'
import { Pencil2Icon } from '@radix-ui/react-icons'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default () => {
    const [ error, setError ] = useState(false)
    const router = useRouter()
    const action = () => createProject().then(
        id => { setError(false); router.push('/dashboard/editor/' + id) },
        () => { setError(true) }
    )
    return error
        ? <Error title='Database Error' />
        : (
            <section className='flex flex-col gap-y-5 justify-center items-center size-full h-[50dvh]'>
                <h1 className='text-2xl font-medium text-neutral-500'>Start creating content</h1>
                <button onClick={ action } className='rounded-lg px-2 py-1 outline-1 outline-neutral-200 text-lg gap-x-2 font-semibold flex justify-center items-center cursor-pointer' role='button'>
                    <span><Pencil2Icon className='text-neutral-500' /></span>
                    <span>New Project</span>
                </button>
            </section>
        )
}
