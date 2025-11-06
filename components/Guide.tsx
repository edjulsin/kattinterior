import Bottom from '@/components/Bottom';
import Image, { StaticImageData } from 'next/image';
import React from 'react';

const Guide = (
    { thumbnail: { src, alt, width, height }, title, description, contentTitle, contentList: [[headTitle, headDescription], ...contents], contactCopy }: {
        thumbnail: { src: StaticImageData, alt: string, width: number, height: number },
        title: string,
        description: string[],
        contentTitle: string,
        contentList: [string, string][],
        contactCopy?: string
    }) =>
    <>
        <section className='max-w-2xs sm:max-w-sm lg:max-w-full grid grid-rows-[auto_auto_auto] lg:grid-rows-[1fr_auto] lg:grid-cols-[auto_1fr] gap-x-15 justify-center items-center gap-y-15'>
            <Image
                className='h-100 sm:h-120 max-w-sm w-full row-span-2 object-cover object-center rounded-tl-full rounded-tr-full'
                src={src}
                alt={alt}
                width={width}
                height={height}
            />
            <div className='lg:max-w-xl'>
                <h1 key={title} className='text-xl/loose sm:text-2xl/loose lg:text-3xl/loose font-serif full-slide-from-bottom anim-delay-[300ms]'>{title}</h1>
                {
                    description.map(paragraph =>
                        <React.Fragment key={paragraph}>
                            <br />
                            <p className='text-base sm:text-lg font-medium font-sans slide-from-bottom'>{paragraph}</p>
                        </React.Fragment>
                    )
                }
            </div>
            <div className='text-center justify-self-center lg:justify-self-start'>
                <br />
                <br />
                <span className='text-5xl font-serif'>&darr;</span>
            </div>
        </section>
        <section className='flex flex-col gap-y-20 max-w-2xs sm:max-w-sm lg:max-w-full'>
            <h2 className='text-xl/loose sm:text-2xl/loose text-center font-serif full-slide-from-bottom'>{contentTitle}</h2>
            <ol className='*:max-w-sm grid justify-center items-center auto-rows-fr gap-y-10 sm:gap-y-15 md:gap-y-20 lg:gap-y-25 gap-x-30 lg:grid-cols-2 lg:*:row-span-3 lg:*:odd:justify-self-start lg:*:even:justify-self-end'>
                <li key={'first'} className='flex flex-col justify-center gap-y-4 lg:col-start-2 slide-from-bottom anim-delay-[100ms]'>
                    <h3 className='text-xl/loose sm:text-2xl/loose font-serif flex flex-col'>
                        <span className='text-2xl sm:text-3xl opacity-50'>00</span>
                        <span>{headTitle}</span>
                    </h3>
                    <p className='text-base sm:text-lg font-medium font-sans'>{headDescription}</p>
                </li>
                {
                    contents.map(([title, description], i) =>
                        <li key={title} className='flex flex-col justify-center gap-y-4 slide-from-bottom anim-delay-[100ms]'>
                            <h3 className='text-xl/loose sm:text-2xl/loose font-serif flex flex-col'>
                                <span className='text-2xl sm:text-3xl opacity-50'>{(i + 1 < 10 ? '0' : '') + (i + 1)}</span>
                                <span>{title}</span>
                            </h3>
                            <p className='text-base sm:text-lg font-medium font-sans'>{description}</p>
                        </li>
                    )
                }
            </ol>
        </section>
        <Bottom copy={contactCopy} />
    </>

export default Guide