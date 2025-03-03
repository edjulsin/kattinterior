'use client'

import Form from 'next/form'
import send from '@/action/form'
import { useActionState } from 'react'

export default () => {
    const [state, action] = useActionState(send, {})
    return (
        <Form className='flex flex-col place-items-center max-w-xs size-full gap-y-4 p-4 font-sans rounded-md' action={ action }>
            <div className='flex flex-col gap-y-1 size-full text-lg'>
                <label className='font-bold text-md sr-only' htmlFor='email'>Email <span>*</span></label>
                <input placeholder='Email' className='ring-1 ring-neutral-200 py-1 px-2 rounded-md font-semibold' id='email' type='email' name='email' required />
            </div>
            <div className='flex flex-col gap-y-1 size-full text-lg'>
                <label className='font-bold text-md sr-only' htmlFor='message'>Message <span>*</span></label>
                <textarea placeholder='Message' className='ring-1 ring-neutral-200 py-1 px-2 rounded-md font-semibold min-h-40' id='message' name='message' required />
            </div>
            <button className='font-bold size-full rounded-md cursor-pointer text-xl py-1 px-2 ring-neutral-200 ring-1'>Send &rarr;</button>
        </Form>
    )
}