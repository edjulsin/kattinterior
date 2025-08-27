const Gallery = ({ title, children }: { title: string, children: React.ReactNode }) =>
    <section className='flex flex-col gap-y-16'>
        <h5 className='text-center font-serif text-lg full-slide-from-bottom anim-delay-[100ms]'>{ title }</h5>
        <section
            className='
                grid 
                gap-y-20
                place-items-center 
                grid-flow-row-dense
                py-14
                sm:grid-cols-2
                sm:[&>*:not(a)]:col-span-2
                lg:grid-cols-3
                lg:[&>a]:row-span-4
                lg:[&>*:not(a)]:col-span-3
                lg:[&>:nth-child(2)]:row-start-3
                lg:[&>a:nth-child(3n+1)]:col-start-1
                lg:[&>a:nth-child(3n+2)]:col-start-2
                lg:[&>a:nth-child(3n+3)]:col-start-3
                xl:gap-y-30
            '
        >
            { children }
        </section>
    </section>

export default Gallery