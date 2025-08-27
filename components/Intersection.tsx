'use client'

import React, { useEffect } from 'react'

const Intersection = ({ selectors, callback, options, children }: Readonly<{
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

        elements.forEach(el => {
            el.dataset.intersected = 'false'
            el.dataset.intersecting = 'false'
        })

        elements.forEach(el =>
            observer.observe(el)
        )

        return () => { observer.disconnect() }

    }, [ selectors ])

    return children ?? null
}

export default Intersection