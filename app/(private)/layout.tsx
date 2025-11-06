import Dark from '@/components/Dark';

const Layout = ({ children }: { children: React.ReactNode }) =>
    <>
        <Dark />
        {children}
    </>

export default Layout