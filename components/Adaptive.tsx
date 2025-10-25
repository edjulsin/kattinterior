'use client'

import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const Adaptive = ({ children }: { children: React.ReactNode }) => {
    const path = usePathname()
    const [className, setClassName] = useState('')

    useEffect(() => {
        if(path === '/' || path === '/contact') {
            setClassName('')
        } else {
            setClassName('opacity-50')
        }
    }, [path])

    return (
        <div className={`size-full ${className}`}>
            {children}
        </div>
    )
}

export default Adaptive