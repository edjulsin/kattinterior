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
            element.dataset.rx = element.dataset.rx ?? '1'
            element.dataset.ry = element.dataset.ry ?? '1'
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

            const rx = Math.max(0, (r.width * s) - r.width) / 2
            const ry = Math.max(0, (r.height * s) - r.height) / 2

            const vc = window.innerHeight / 2
            const ec = (r.top + r.height) / 2
            const sx = clamp(
                0,
                1,
                Number(v.dataset.rx)
            )
            const sy = clamp(
                0,
                1,
                Number(v.dataset.ry)
            )

            const progress = clamp(-.5, .5, (vc - ec) / window.innerHeight) * 2

            const ox = Number(v.dataset.px) * progress * rx * sx
            const oy = Number(v.dataset.py) * progress * ry * sy

            img.style.transform = `translate3d(${ox}px, ${oy}px, 0)`
        })

    }, [ selectors ])

    return children ?? null
}

export default Parallax