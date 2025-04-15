import { AccessibleIcon } from '@radix-ui/react-accessible-icon'
import clsx from 'clsx'
import { useEffect, useState } from 'react'

export default ({ state, className, ...props }: { state: boolean, className?: string }) => {
    const [ animate, setAnimate ] = useState(false)

    const label = state ? 'open' : 'close'

    useEffect(() => () => setAnimate(true), [ state ])

    return (
        <button className={ clsx(className, 'hamburger', { [ `hamburger-${label}` ]: animate }) } { ...props }>
            <AccessibleIcon label={ label }>
                <svg
                    viewBox='0 0 100 100'
                    className={ clsx('hamburger-icon', { [ `hamburger-icon-${label}` ]: animate }) }
                    shapeRendering='crispEdges'
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
            </AccessibleIcon>
        </button >
    )
}

