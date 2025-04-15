'use client'

import Form from 'next/form'
import send from '@/action/form'
import { useActionState } from 'react'

export default () => {
    const [ state, action ] = useActionState(send, {})
    return (
        <Form className='grid grid-rows-[auto_auto_auto] items-center max-w-md size-full gap-y-4 p-4 font-sans rounded-md text-base font-semibold ' action={ action }>
            <div className='flex flex-col gap-y-1 size-full'>
                <label className='font-bold text-md sr-only' htmlFor='name'>Name <span>*</span></label>
                <input placeholder='Name' className='rounded-lg outline-1 outline-neutral-200 py-1 px-2 focus:outline-1 focus:outline-amber-500' id='name' type='name' name='name' required />
            </div>
            <div className='flex flex-col gap-y-1 size-full'>
                <label className='font-bold text-md sr-only' htmlFor='email'>Email <span>*</span></label>
                <input placeholder='Email' className='rounded-lg outline-1 outline-neutral-200 py-1 px-2 focus:outline-1 focus:outline-amber-500' id='email' type='email' name='email' required />
            </div>
            <div className='flex flex-col gap-y-1 size-full'>
                <label className='font-bold text-md sr-only' htmlFor='message'>Message <span>*</span></label>
                <textarea placeholder='Message' className='rounded-lg outline-1 outline-neutral-200 py-1 px-2 min-h-36 focus:outline-1 focus:outline-amber-500' id='message' name='message' required />
            </div>
            <br />
            <button className='font-bold rounded-lg cursor-pointer py-2 px-3 ring-neutral-200 ring-1'>Submit &rarr;</button>
        </Form>
    )
}