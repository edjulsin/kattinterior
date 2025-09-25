'use client'

import clsx from 'clsx'
import { AccessibleIcon } from 'radix-ui'
import { useEffect, useState } from 'react'

const Hamburger = ({ state, className, ...props }: { state: boolean, className?: string }) => {
    const [ animate, setAnimate ] = useState(false)

    const hamburger = state ? `hamburger-open` : `hamburger-close`

    const icon = state ? 'hamburger-icon-open' : 'hamburger-icon-close'

    useEffect(() => () => setAnimate(true), [ state ])

    return (
        <button className={ clsx(className, 'hamburger', { [ hamburger ]: animate }) } { ...props }>
            <AccessibleIcon.Root label={ state ? 'open' : 'close' }>
                <svg
                    viewBox='0 0 100 100'
                    className={ clsx('hamburger-icon', { [ icon ]: animate }) }
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
            </AccessibleIcon.Root>
        </button >
    )
}

export default Hamburger

