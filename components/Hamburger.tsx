import { AccessibleIcon } from 'radix-ui'

const Hamburger = ({ state }: { state: boolean }) =>
    <AccessibleIcon.Root label={ state ? 'open' : 'close' }>
        <svg
            viewBox='0 0 100 100'
            className='hamburger-icon'
            shapeRendering='crispEdges'
            data-state={ state ? 'open' : 'closed' }
        >
            <line
                x1={ '30%' }
                x2={ '70%' }
                y1={ '50%' }
                y2={ '50%' }
            />
            <line
                x1={ '30%' }
                x2={ '70%' }
                y1={ '50%' }
                y2={ '50%' }
            />
        </svg>
    </AccessibleIcon.Root>

export default Hamburger

