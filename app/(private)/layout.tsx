import Dark from '@/components/Dark';

const PrivateLayout = ({ children }: { children: React.ReactNode }) =>
    <>
        <Dark />
        {children}
    </>

export default PrivateLayout