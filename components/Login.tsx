'use client'

import Logo from '@/components/Logo'
import { signIn } from '@/action/server'
import { useActionState } from 'react'
import { CheckCircledIcon, CrossCircledIcon } from '@radix-ui/react-icons'
import { isValidEmail } from '@/utility/fn'

const login = (state: { message: string, success: boolean }, form: FormData) => {
    const email = (form.get('email') + '').trim()
    if(isValidEmail(email)) {
        return signIn(email).then(
            () => ({ message: 'Check your inbox', success: true }),
            () => ({ message: 'Something is wrong', success: false })
        )
    } else {
        return Promise.resolve({ message: 'Something is Wrong', success: false })
    }
}

export default () => {
    const [ { message, success }, action, pending ] = useActionState(login, { message: '', success: false })
    return (
        <main className='h-[65dvh] w-full flex flex-col justify-center items-center'>
            <section className='flex flex-col justify-center items-center gap-y-5 font-sans text-base'>
                <span className='p-5'>
                    <Logo className='max-h-9 size-full' />
                </span>
                <form action={ action } className='flex flex-col justify-center gap-y-4 min-w-3xs'>
                    <label htmlFor='email' className='sr-only'>Email</label>
                    <input
                        className='font-semibold px-3 py-1.5 rounded-lg bg-neutral-200 focus:outline-1 focus:outline-orange-500 disabled:text-neutral-500 disabled:cursor-not-allowed'
                        type='email'
                        name='email'
                        id='email'
                        required={ true }
                        disabled={ pending || success }
                        placeholder='Email'
                    />
                    <button
                        disabled={ pending || success }
                        type='submit'
                        className='outline-1 outline-neutral-200 shadow-sm font-bold px-3 py-1.5 cursor-pointer rounded-lg disabled:text-neutral-500 disabled:cursor-not-allowed'
                    >
                        Sign in
                    </button>
                </form>
                {
                    message
                        ? <p className='flex items-center justify-center gap-x-2 font-semibold'>
                            <span>{ success ? <CheckCircledIcon className='text-green-500' /> : <CrossCircledIcon className='text-red-500' /> }</span>
                            <span>{ message }</span>
                        </p>
                        : null
                }
            </section>
        </main>
    )
}