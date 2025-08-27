'use client'

import { storageAvailable } from '@/utility/fn'
import * as Switch from '@radix-ui/react-switch'
import clsx from 'clsx'
import { useEffect, useState } from 'react'

const storage = storageAvailable('localStorage')

const Theme = () => {
    const [ checked, setChecked ] = useState(false)

    const onChange = (value: boolean) => {
        setChecked(value)
        if(storage) {
            document.documentElement.classList.toggle('dark')
            localStorage.setItem('theme', value ? 'dark' : 'light')
        }
    }

    useEffect(() => {
        if(storage) {
            const checked =
                localStorage.theme === 'dark' ||
                !(('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)

            document.documentElement.classList.toggle('dark', checked)
            setChecked(checked)
        }
    }, [])

    return (
        <div className='inline-block rounded-full'>
            <label className='sr-only' htmlFor='theme'>Switch theme</label>
            <Switch.Root
                id='theme'
                className={ clsx('w-8 h-4 rounded-full bg-gold-100') }
                onCheckedChange={ onChange }
                checked={ checked }
            >
                <Switch.Thumb
                    className={ clsx(
                        'block size-4 rounded-full bg-gold-300 ring-1 ring-gold-300 transition-[translate] ease-in-out duration-200',
                        checked ? 'translate-x-4' : 'translate-x-0'
                    ) }
                />
            </Switch.Root>
        </div>
    )
}

export default Theme