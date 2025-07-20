'use client'

import React, { useEffect } from 'react'

export default ({ selectors, callback, options, children }: Readonly<{
    callback: (entries: IntersectionObserverEntry[]) => void,
    selectors: string[],
    children?: React.ReactNode,
    options?: IntersectionObserverInit
}>) => {

    useEffect(() => {
        const elements = selectors.flatMap(v => {
            return [ ...document.querySelectorAll(v) ] as HTMLElement[]
        })
        const observer = new IntersectionObserver(callback, options)

        elements.forEach(el =>
            observer.observe(el)
        )

        return () => { observer.disconnect() }

    }, [ selectors ])

    return children ?? null
}