'use client'

import useDarkMode from '@/hook/useDarkMode'
import clsx from 'clsx'
import { Switch } from 'radix-ui'

const Theme = () => {
    const [darkMode, setDarkMode] = useDarkMode()
    return (
        <div className='inline-block rounded-full'>
            <label className='sr-only' htmlFor='theme'>Switch theme</label>
            <Switch.Root
                id='theme'
                className={clsx('w-8 h-4 rounded-full bg-gold-100')}
                checked={darkMode}
                onCheckedChange={setDarkMode}
            >
                <Switch.Thumb
                    className={
                        clsx(
                            'block size-4 rounded-full bg-gold-300 ring-1 ring-gold-300 transition-[translate] ease-in-out duration-200',
                            darkMode ? 'translate-x-4' : 'translate-x-0'
                        )
                    }
                />
            </Switch.Root>
        </div>
    )
}

export default Theme