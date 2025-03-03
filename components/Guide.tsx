import Bottom from '@/components/Bottom';
import Image from 'next/image';

export default (
    { thumbnail: { src, alt, width, height }, title, description, contentTitle, contentList: [[headTitle, headDescription], ...contents], contactCopy }: {
        thumbnail: { src: string, alt: string, width: number, height: number },
        title: string,
        description: string[],
        contentTitle: string,
        contentList: [string, string][],
        contactCopy?: string
    }) => (
    <div className='flex flex-col gap-y-40'>
        <section className='grid grid-cols-[auto_auto] grid-rows-[auto_auto]'>
            <Image
                className='h-140 w-100 row-span-2 self-center justify-self-center object-cover object-center rounded-tl-full rounded-tr-full'
                src={ src }
                alt={ alt }
                width={ width }
                height={ height }
            />
            <div className='max-w-md self-end'>
                <h1 key={ title } className='text-4xl/loose font-serif'>{ title }</h1>
                {
                    description.map(paragraph =>
                        <>
                            <br key={ paragraph + 'br' } />
                            <p key={ paragraph } className='text-lg font-semibold font-sans'>{ paragraph }</p>
                        </>
                    )
                }
            </div>
            <span className='text-5xl font-serif self-end'>&darr;</span>
        </section>
        <section className='flex flex-col gap-y-20'>
            <span className='text-xl text-center font-serif'>{ contentTitle }</span>
            <ol className='*:max-w-sm grid grid-cols-2 place-items-center auto-rows-fr *:row-span-3 gap-y-20'>
                <li key={ 'first' } className='col-start-2'>
                    <h6 className='text-2xl/relaxed font-serif flex flex-col'>
                        <span className='text-4xl'>00</span>
                        <span>{ headTitle }</span>
                    </h6>
                    <br />
                    <p className='text-lg font-semibold font-sans'>{ headDescription }</p>
                </li>
                {
                    contents.map(([title, description], i) =>
                        <li key={ title }>
                            <h6 className='text-2xl/relaxed font-serif flex flex-col'>
                                <span className='text-4xl'>{ (i + 1 < 10 ? '0' : '') + (i + 1) }</span>
                                <span>{ title }</span>
                            </h6>
                            <br />
                            <p className='text-lg font-semibold font-sans'>{ description }</p>
                        </li>
                    )
                }
            </ol>
        </section>
        <Bottom copy={ contactCopy } />
    </div>
)