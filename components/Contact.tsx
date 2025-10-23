'use client'

import { useActionState } from 'react'
import { sendEmail } from '@/action/server'
import { CheckCircledIcon, CrossCircledIcon } from '@radix-ui/react-icons'

const send = (state: { message: string, token: string, name: string, email: string, error: boolean, success: boolean, mail: string }, formData: FormData) =>
    sendEmail(formData).then(
        v => ({ ...state, ...v, success: true, error: false }),
        v => ({ ...state, ...v, success: false, error: true })
    )

const Contact = () => {
    const [state, action, pending] = useActionState(send, { other: '', name: '', email: '', message: '', success: false, error: false })

    const Failed = ({ error }: { error: string }) =>
        <div className='flex justify-center items-center gap-x-1'>
            <CrossCircledIcon className='text-red-500' />
            <small className='text-base text-center'>{error}</small>
        </div>

    const Success =
        <div className='flex justify-center items-center gap-x-1'>
            <CheckCircledIcon className='text-green-500' />
            <small className='text-base text-center'>Your message has been sent</small>
        </div>

    const Error = ({ error }: { error: string }) =>
        <small className='text-red-500 text-base'>{error}</small>

    return (
        <form action={action} className='grid grid-rows-[auto_auto_auto] items-center max-w-lg size-full gap-y-10 p-4 font-sans rounded-md text-xl'>
            <div className='flex flex-col gap-y-1 size-full'>
                <label className='font-bold text-md sr-only' htmlFor='name'>Name <span>*</span></label>
                <input
                    className='border-b-1 border-b-gold-200 py-1 px-2 focus:outline-1 focus:outline-transparent focus:border-b-amber-500'
                    placeholder='Name'
                    id='name'
                    type='text'
                    name='name'
                    minLength={2}
                    maxLength={50}
                    required
                />
                {state.error && state.name ? <Error error={state.name} /> : null}
            </div>
            <div className='flex flex-col gap-y-1 size-full'>
                <label className='font-bold text-md sr-only' htmlFor='email'>Email <span>*</span></label>
                <input
                    className='border-b-1 border-b-gold-200 py-1 px-2 focus:outline-1 focus:outline-transparent focus:border-b-amber-500'
                    placeholder='Email'
                    id='email'
                    type='email'
                    name='email'
                    required
                />
                {state.error && state.email ? <Error error={state.email} /> : null}
            </div>
            <div className='flex flex-col gap-y-1 size-full'>
                <label className='font-bold text-md sr-only' htmlFor='message'>Message <span>*</span></label>
                <textarea
                    className='border-b-1 border-b-gold-200 py-1 px-2 min-h-36 focus:outline-1 focus:outline-transparent focus:border-b-amber-500'
                    placeholder='Message'
                    id='message'
                    name='message'
                    minLength={10}
                    maxLength={1000}
                    required
                />
                <style jsx>{`
                    #message {
                        scrollbar-width: thin;
                    }
                `}</style>
                {state.error && state.message ? <Error error={state.message} /> : null}
            </div>
            <button
                className='font-semibold rounded-full cursor-pointer py-2 px-3 outline-1 outline-gold-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed'
                disabled={pending || state.success}
            >
                Submit &rarr;
            </button>
            {state.success ? Success : state.error && state.other ? <Failed error={state.other} /> : null}
        </form>
    )
}

export default Contact