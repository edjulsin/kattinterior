'use client'

import { AccessibleIcon } from 'radix-ui'
import { ButtonHTMLAttributes } from 'react'

const Hamburger = (props: ButtonHTMLAttributes<HTMLButtonElement>) =>
    <button { ...props } className='hamburger'>
        <AccessibleIcon.Root label='menu'>
            <svg
                viewBox='0 0 100 100'
                shapeRendering='crispEdges'
            >
                <line
                    x1='30%'
                    x2='70%'
                    y1='50%'
                    y2='50%'
                />
                <line
                    x1='30%'
                    x2='70%'
                    y1='50%'
                    y2='50%'
                />
            </svg>
        </AccessibleIcon.Root>
    </button>

export default Hamburger

