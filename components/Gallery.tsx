import React from 'react'

const Gallery = ({ heading, children }: { heading: string, children: React.ReactNode }) =>
    <section className='flex flex-col gap-y-20'>
        {
            React.createElement(
                heading,
                { className: 'text-center font-sans text-3xl font-medium full-slide-from-bottom anim-delay-[100ms] text-gold-900' },
                'Design Stories'
            )
        }
        <section
            className='
                grid 
                gap-y-30
                place-items-center 
                grid-flow-row-dense
                md:grid-cols-2
                md:[&>*:not(a)]:col-span-2
                xl:grid-cols-3
                xl:[&>a]:row-span-4
                xl:[&>*:not(a)]:col-span-3
                xl:[&>:nth-child(2)]:row-start-3
                xl:[&>a:nth-child(3n+1)]:col-start-1
                xl:[&>a:nth-child(3n+2)]:col-start-2
                xl:[&>a:nth-child(3n+3)]:col-start-3
            '
        >
            {children}
        </section>
    </section>

export default Gallery