import Intersection from './Intersection'
import Spinner from './Spinner'

const Loader = ({ enabled, children, callback }: {
    callback: (entries: IntersectionObserverEntry[]) => void,
    enabled: boolean,
    children?: React.ReactNode
}) =>
    <Intersection
        selectors={ [ '.spinner' ] }
        callback={ callback }
    >
        { children ?? null }
        { enabled ? <Spinner className='spinner size-8 text-gold-950' /> : null }
    </Intersection>

export default Loader