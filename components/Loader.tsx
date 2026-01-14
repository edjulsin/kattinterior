'use client'

import Intersection from './Intersection'
import Spinner from './Spinner'

const Loader = ({ enabled, children, callback }: {
    callback: (entries: IntersectionObserverEntry[]) => void,
    enabled: boolean,
    children?: React.ReactNode
}) =>
    <Intersection
        selectors={['.spinner']}
        callback={callback}
        options={{ threshold: 1 }}
    >
        {children ?? null}
        {enabled ? <Spinner /> : null}
    </Intersection>

export default Loader