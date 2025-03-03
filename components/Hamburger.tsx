import { AccessibleIcon } from '@radix-ui/react-accessible-icon'
import clsx from 'clsx'

export default ({ state = '', className = '', ...props }) => (
    <button className={ clsx(className, 'hamburger', { [`hamburger-${state}`]: state }) } { ...props }>
        <AccessibleIcon label={ state || 'open' }>
            <svg
                viewBox='0 0 100 100'
                className={ clsx('hamburger-icon', { [`hamburger-icon-${state}`]: state }) }
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