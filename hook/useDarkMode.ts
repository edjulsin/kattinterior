'use client'

import { storageAvailable } from '@/utility/fn'
import { useState, useEffect } from 'react'

const storage = storageAvailable('localStorage')

const useDarkMode = (): [boolean, (value: boolean) => void] => {
    const [theme, setTheme] = useState(false)

    const toggleTheme = (value: boolean) => {
        setTheme(value === true)
        if(storage) {
            document.documentElement.classList.toggle('dark')
            localStorage.setItem('theme', value ? 'dark' : 'light')
        }
    }

    useEffect(() => {
        if(storage) {
            const dark =
                localStorage.theme === 'dark' ||
                !(('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)

            document.documentElement.classList.toggle('dark', dark)
            setTheme(dark)
        }
    }, [])

    return [theme, toggleTheme]
}

export default useDarkMode