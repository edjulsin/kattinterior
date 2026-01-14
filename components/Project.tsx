import { Items, Project as ProjectType, Item, Photo } from '@/type/editor';
import { ab, extent, getItemsHeight, getLayout, imageToItemScale, last, ys } from '@/utility/fn';
import Image from 'next/image';
import Style from './Style';

const brand = process.env.NEXT_PUBLIC_SITE_NAME

const Project = ({ name, location, story, tagline, assets, template }: ProjectType) => {
    const atBreakpoint = (breakpoint: number, style: string): string => {
        if(style) {
            return `
                @media (min-width: ${breakpoint}px) {
                    ${style}
                }
            `
        } else {
            return ''
        }
    }

    const join = (styles: string[]) => styles.join('\n')

    const dw = template.desktop.width
    const dh = getItemsHeight(template.desktop.items)

    const tw = template.tablet.width
    const th = getItemsHeight(template.tablet.items)

    const mw = template.mobile.width
    const mh = getItemsHeight(template.mobile.items)

    const layout = getLayout(template)

    const table = (items: Items): Record<string, Item> =>
        items.reduce((a, b) => ({ ...a, [b.id]: b }), {})

    const desktop = table(template.desktop.items)
    const tablet = table(template.tablet.items)
    const mobile = table(template.mobile.items)

    const desktops = layout.map(v =>
        v.filter(v => v.id in desktop).map(v => desktop[v.id])
    )

    const tablets = layout.map(v =>
        v.filter(v => v.id in tablet).map(v => tablet[v.id])
    )

    const mobiles = layout.map(v =>
        v.filter(v => v.id in mobile).map(v => mobile[v.id])
    )

    const getGaps = (rows: Items[]) => {
        if(rows.length > 0) {
            const [initial] = rows
            return ab(
                (a, b, c: number[]) => {
                    const x = Math.max(
                        ...extent(ys, a)
                    )
                    const y = Math.min(
                        ...extent(ys, b)
                    )
                    return [...c, y - x]
                },
                rows,
                [
                    Math.min(
                        ...extent(ys, initial)
                    )
                ]
            )
        } else {
            return []
        }
    }

    const desktopExcludes = [...template.tablet.items, ...template.mobile.items]
        .filter(v => !(v.id in desktop))
        .reduce<Items>((a, b) => a.some(v => b.id === v.id) ? a : a.concat([b]), [])
    const tabletExcludes = [...template.desktop.items, ...template.mobile.items]
        .filter(v => !(v.id in tablet))
        .reduce<Items>((a, b) => a.some(v => b.id === v.id) ? a : a.concat([b]), [])
    const mobileExcludes = [...template.desktop.items, ...template.tablet.items]
        .filter(v => !(v.id in mobile))
        .reduce<Items>((a, b) => a.some(v => b.id === v.id) ? a : a.concat([b]), [])

    const desktopIgnores = desktops.reduce<number[]>((a, b, i) => b.length > 0 ? a : ([...a, i]), [])
    const tabletIgnores = tablets.reduce<number[]>((a, b, i) => b.length > 0 ? a : ([...a, i]), [])
    const mobileIgnores = mobiles.reduce<number[]>((a, b, i) => b.length > 0 ? a : ([...a, i]), [])

    const desktopIncludes = desktops.reduce<[number, Items][]>((a, b, i) => {
        if(b.length > 0) {
            return [...a, [i, b]]
        } else {
            return a
        }
    }, [])

    const tabletIncludes = tablets.reduce<[number, Items][]>((a, b, i) => {
        if(b.length > 0) {
            return [...a, [i, b]]
        } else {
            return a
        }
    }, [])

    const mobileIncludes = mobiles.reduce<[number, Items][]>((a, b, i) => {
        if(b.length > 0) {
            return [...a, [i, b]]
        } else {
            return a
        }
    }, [])

    const asset = Object.fromEntries(
        assets.map(v => {
            return [v.id, v]
        })
    )

    const responsiveStyles = (w: number, h: number, layout: [number, Items][]) => {
        const gaps = getGaps(
            layout.map(last)
        )
        const container = `
            .layout { 
                opacity: 100%;
                aspect-ratio: ${w} / ${h};
            }
        `
        return [
            container,
            ...layout.flatMap(([i, row], j) => {
                const [sy, ey] = extent(ys, row)
                const gap = gaps[j]
                const height = Math.max(0, (ey - sy) + gap)
                const section = `
                    .section-${i} {
                        display: block;
                        position: relative;
                        height: ${(height / h) * 100}cqh;
                    }
                `

                return [
                    section,
                    ...row.flatMap(v => {
                        const item = `
                            .item-${v.id} {
                                position: absolute; 
                                display: block;
                                overflow: clip;
                                z-index: ${v.z};
                                left: ${(v.x / w) * 100}%;
                                top: ${(((v.y - sy) + gap) / height) * 100}%;
                                width: ${(v.w / w) * 100}cqw;
                                height: ${(v.h / h) * 100}cqh;
                            }
                        `
                        const img = asset[v.src]
                        const scale = imageToItemScale(img, v)
                        const imgWidth = ((img.width * scale) / w) * 100
                        const imgHeight = ((img.height * scale) / h) * 100
                        const image = `
                            .item-${v.id} > .image-${img.id} {
                                translate: ${-v.sx * 100}% ${-v.sy * 100}%;
                                width: ${imgWidth}cqw;
                                height: ${imgHeight}cqh;
                                max-width: ${imgWidth}cqw;
                                max-height: ${imgHeight}cqh;
                            }   
                        `
                        return [item, image]
                    })
                ]
            })
        ]
    }

    const styles = [
        join([
            ...responsiveStyles(mw, mh, mobileIncludes),
            ...mobileIgnores.map(v =>
                `.section-${v} { display: none; height: 0px; }`
            ),
            ...mobileExcludes.map(v =>
                `.item-${v.id} { display: none; }`
            )
        ]),
        atBreakpoint(
            tw,
            join([
                ...responsiveStyles(tw, th, tabletIncludes),
                ...tabletIgnores.map(v =>
                    `.section-${v} { display: none; height: 0px; }`
                ),
                ...tabletExcludes.map(v =>
                    `.item-${v.id} { display: none; }`
                )
            ])
        ),
        atBreakpoint(
            dw,
            join([
                ...responsiveStyles(dw, dh, desktopIncludes),
                ...desktopIgnores.map(v =>
                    `.section-${v} { display: none; height: 0px; }`
                ),
                ...desktopExcludes.map(v =>
                    `.item-${v.id} { display: none; }`
                )
            ])
        )
    ].filter(v => v)

    const formatAlt = (v: string) => `${v || 'Interior'} Designed By ${brand}`

    const sizes = (image: Photo, item: Item) => {
        const parallax = (v: Item) => v.effect === 'parallax' ? 1.2 : 1
        const m = [mobile[item.id]].filter(v => v).map(v =>
            `(max-width: ${mw}px) ${Math.ceil(image.width * imageToItemScale(image, v) * parallax(v))}px`
        )
        const t = [tablet[item.id]].filter(v => v).map(v =>
            `(max-width: ${tw}px) ${Math.ceil(image.width * imageToItemScale(image, v) * parallax(v))}px`
        )
        const d = [desktop[item.id]].filter(v => v).map(v =>
            `${Math.ceil(image.width * imageToItemScale(image, v) * parallax(v))}px`
        )
        return [m, t, d].flat().join(', ')
    }

    return (
        <article className='flex flex-col items-center justify-center gap-y-30 py-5 w-full overflow-clip'>
            <header className='flex flex-col items-center justify-center gap-y-10 text-center whitespace-pre-wrap w-full'>
                <div className='flex flex-col items-center justify-center gap-y-5'>
                    <h1 className='font-serif text-2xl/relaxed md:text-3xl/relaxed max-w-2xs md:max-w-md capitalize'>{name}</h1>
                    <h2 className='font-serif text-sm/relaxed md:text-base/relaxed max-w-2xs md:max-w-sm capitalize'>{location}</h2>
                </div>
                <p className='font-sans font-medium text-base md:text-lg slide-from-bottom max-w-2xs md:max-w-md xl:max-w-lg'>
                    {story}
                </p>
                <h3 className='font-serif text-sm/loose md:text-base/loose xl:text-lg/loose slide-from-bottom max-w-2xs md:max-w-lg xl:max-w-2xl'>
                    {tagline}
                </h3>
            </header>
            <div className='w-full opacity-0 layout' style={{ containerType: 'size' }}>
                {
                    layout.map((items, i) =>
                        <section key={i} className={`w-full section-${i}`}>
                            {
                                items.map(item => {
                                    const image = asset[item.src]
                                    return (
                                        <div
                                            key={item.id}
                                            className={`anim-delay-[125ms] item-${item.id}` + (item.effect ? ` ${item.effect}` : '')}
                                        >
                                            <Image
                                                className={`anim-delay-[125ms] image-${image.id}`}
                                                src={image.src}
                                                width={image.width}
                                                height={image.height}
                                                loading={i === 0 ? 'eager' : 'lazy'}
                                                sizes={sizes(image, item)}
                                                alt={formatAlt(image.alt)}
                                            />
                                        </div>
                                    )
                                })
                            }
                        </section>
                    )
                }
                <Style style={join(styles)} />
            </div>
        </article>
    )
}

export default Project
