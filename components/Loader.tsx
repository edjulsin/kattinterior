import Intersection from './Intersection'
import Spinner from './Spinner'

export default ({ enabled, children, callback }: {
    callback: (entries: IntersectionObserverEntry[]) => void,
    enabled: boolean,
    children?: React.ReactNode
}) =>
    <Intersection
        selectors={ [ '.spinner' ] }
        callback={ callback }
    >
        { children ?? null }
        { enabled ? <Spinner className='spinner size-8 text-neutral-500' /> : null }
    </Intersection>