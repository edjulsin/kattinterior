'use client'

import { clamp } from '@/utility/fn'
import { useLenis } from 'lenis/react'
import { useEffect } from 'react'

const Parallax = ({ children, selectors }: { selectors: string[], children?: React.ReactNode }) => {

    useEffect(() => {
        const els = selectors.flatMap(selector => {
            return [ ...document.querySelectorAll(selector) ]
        })

        els.forEach(el => {
            const element = el as HTMLElement

            element.dataset.px = element.dataset.px ?? '0'
            element.dataset.py = element.dataset.py ?? '-1'
        })

    }, [ selectors ])

    useLenis(() => {
        const els = selectors.flatMap(selector =>
            ([ ...document.querySelectorAll(selector) ]).filter(v => {
                const el = v as HTMLElement
                return el.dataset.intersected === 'true'
            })
        )

        const s = 1.2

        els.forEach(element => {
            const v = element as HTMLElement
            const img = element.firstChild as HTMLImageElement
            const r = element!.getBoundingClientRect()
            const sw = r.width * s
            const sh = r.height * s

            const rx = Math.max(0, sw - r.width)
            const ry = Math.max(0, sh - r.height)

            const vc = (window.innerHeight / 2)
            const ec = (r.top + r.height) / 2

            const progress = clamp(-.5, .5, (vc - ec) / window.innerHeight)

            const dx = Number(v.dataset.px)
            const dy = Number(v.dataset.py)

            const ox = dx * (progress * 2) * (rx / 2)
            const oy = dy * (progress * 2) * (ry / 2)

            img.style.transform = `translate3d(${ox}px, ${oy}px, 0)`
        })

    }, [ selectors ])

    return children ?? null
}

export default Parallax