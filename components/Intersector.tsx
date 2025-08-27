'use client'

import Intersection from './Intersection';

const selectors = [
    '.slide-from-bottom',
    '.slide-from-top',
    '.slide-from-left',
    '.slide-from-right',
    '.scale-up',
    '.scale-down',
    '.rotate-from-quarter',
    '.rotate-to-quarter',
    '.full-slide-from-bottom',
    '.full-slide-from-top',
    '.full-slide-from-left',
    '.full-slide-from-right',
    '.fade-in',
    '.fade-out',
    '.parallax'
]


const onIntersect = (entries: IntersectionObserverEntry[]) =>
    entries.forEach(entry => {
        const el = entry.target as HTMLElement
        const intersecting = entry.isIntersecting ? 'true' : 'false'
        const intersected = el.dataset.intersected === 'true' ? 'true' : intersecting

        el.dataset.intersected = intersected
        el.dataset.intersecting = intersecting
    })


const Intersector = ({ children }: { children?: React.ReactNode }) =>
    <Intersection
        selectors={ selectors }
        callback={ onIntersect }
    >
        { children ?? null }
    </Intersection>

export default Intersector