import Link from 'next/link'
import React from 'react'

const Gallery = ({ heading, children, all }: { all: boolean, heading: string, children: React.ReactNode }) =>
    <section className='flex flex-col justify-center items-center gap-y-20 *:w-full'>
        {
            React.createElement(
                heading,
                { className: 'text-center font-sans text-3xl font-medium full-slide-from-bottom anim-delay-[100ms] text-gold-900' },
                'Design Stories'
            )
        }
        <section // broken when only have single project
            className='
                grid
                gap-y-30
                place-items-center 
                grid-flow-row-dense
                md:grid-cols-2
                xl:grid-cols-3
                xl:[&>*]:row-span-4
                xl:[&>:nth-child(2)]:row-start-3
                xl:[&>*:nth-child(3n+1)]:col-start-1
                xl:[&>*:nth-child(3n+2)]:col-start-2
                xl:[&>*:nth-child(3n+3)]:col-start-3
            '
        >
            {children}
        </section>
        {
            all
                ? null
                : <Link className='text-center font-semibold font-sans text-gold-950 text-lg' href='/projects'>All our projects &rarr;</Link>
        }
    </section>

export default Gallery