import { AccessibleIcon } from '@radix-ui/react-accessible-icon'
import Logo from '@/public/text-logo.svg'

export default ({ className = 'size-full' }: { className?: string }) => (
    <AccessibleIcon label='Katt Interior Design'>
        <Logo className={ className } />
    </AccessibleIcon>
)