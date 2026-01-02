import { Toast } from 'radix-ui'

export type StatusType = {
    open: boolean,
    title: string,
    description: React.ReactNode | string
}
export const Status = ({ status, setStatus }: { status: StatusType, setStatus: (status: StatusType) => void }) =>
    <Toast.Provider>
        <Toast.Root
            className='bg-light dark:bg-dark rounded-lg px-3 py-1 font-sans text-sm font-semibold outline-1 outline-neutral-200'
            open={status.open}
            onOpenChange={open => setStatus({ ...status, open })}
        >
            <Toast.Title className='sr-only'>{status.title}</Toast.Title>
            <Toast.Description className='flex justify-center items-center gap-x-1'>
                {status.description}
            </Toast.Description>
        </Toast.Root>
        <Toast.Viewport className='fixed right-0 bottom-0 p-5 z-50' />
    </Toast.Provider>
