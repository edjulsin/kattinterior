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

const onIntersect = (entries: IntersectionObserverEntry[]) => { }

const Intersector = ({ children }: { children?: React.ReactNode }) =>
    <Intersection
        selectors={selectors}
        callback={onIntersect}
    >
        {children ?? null}
    </Intersection>

export default Intersector