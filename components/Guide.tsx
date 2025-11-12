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
        <section className='max-w-2xs md:max-w-sm xl:max-w-full grid grid-rows-[auto_auto_auto] xl:grid-rows-[1fr_auto] xl:grid-cols-[auto_1fr] justify-center items-center gap-10 xl:gap-y-0'>
            <Image
                className='max-w-sm w-full aspect-[1_/_1.5] row-span-2 object-cover object-center rounded-tl-full rounded-tr-full'
                src={src}
                alt={alt}
                width={width}
                height={height}
                priority={true}
            />
            <div className='xl:max-w-xl flex flex-col gap-y-5'>
                <h1 key={title} className='text-xl/relaxed md:text-2xl/relaxed xl:text-3xl/relaxed font-serif full-slide-from-bottom anim-delay-[300ms]'>{title}</h1>
                {
                    description.map(paragraph =>
                        <p key={paragraph} className='text-base md:text-lg font-medium font-sans slide-from-bottom'>{paragraph}</p>
                    )
                }
            </div>
            <div className='text-center justify-self-center xl:justify-self-start text-amber-600'>
                <br />
                <br />
                <span className='text-5xl font-serif'>&darr;</span>
            </div>
        </section>
        <section className='flex flex-col gap-y-20 max-w-2xs md:max-w-sm xl:max-w-full'>
            <h2 className='text-xl/loose md:text-2xl/loose text-center font-serif full-slide-from-bottom text-gold-900'>{contentTitle}</h2>
            <ol className='*:max-w-sm grid justify-center items-center auto-rows-fr gap-y-10 md:gap-y-15 xl:gap-y-25 gap-x-30 xl:grid-cols-2 xl:*:row-span-3 xl:*:odd:justify-self-start xl:*:even:justify-self-end'>
                <li key={'first'} className='flex flex-col justify-center gap-y-5 xl:col-start-2 slide-from-bottom anim-delay-[100ms]'>
                    <h3 className='text-xl/relaxed md:text-2xl/relaxed font-serif flex flex-col'>
                        <span className='text-gold-900'>00</span>
                        <span>{headTitle}</span>
                    </h3>
                    <p className='text-base md:text-lg font-medium font-sans'>{headDescription}</p>
                </li>
                {
                    contents.map(([title, description], i) =>
                        <li key={title} className='flex flex-col justify-center gap-y-4 slide-from-bottom anim-delay-[100ms]'>
                            <h3 className='text-xl/relaxed md:text-2xl/relaxed font-serif flex flex-col'>
                                <span className='text-gold-900'>{(i + 1 < 10 ? '0' : '') + (i + 1)}</span>
                                <span>{title}</span>
                            </h3>
                            <p className='text-base md:text-lg font-medium font-sans'>{description}</p>
                        </li>
                    )
                }
            </ol>
        </section>
        <Bottom copy={contactCopy} />
    </>

export default Guide