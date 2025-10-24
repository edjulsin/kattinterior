import { Items, Project as ProjectType, Item } from '@/type/editor';
import { ab, extent, getLayout, ys } from '@/utility/fn';
import Image from 'next/image';
import React from 'react';
import Style from './Style';

const development = process.env.NODE_ENV === 'development'
const domain = development ? 'localhost:3000' : process.env.NEXT_PUBLIC_DOMAIN

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

    const asset = Object.fromEntries(
        assets.map(v => {
            return [v.id, v]
        })
    )

    const responsiveStyles = (w: number, h: number, rows: Items[]) => {
        const gaps = getGaps(rows)
        const container = `
            .layout {
                aspect-ratio: ${w} / ${h};
            }
        `
        return [
            container,
            ...rows.flatMap((row, i) => {
                const [sy, ey] = extent(ys, row)
                const gap = gaps[i]
                const height = Math.max(0, (ey - sy) + gap)
                const section = `
                    .section-${i} {
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
                        const scale = Math.max(
                            v.w / (v.sw * img.width),
                            v.h / (v.sh * img.height)
                        )
                        const image = `
                            .item-${v.id} > .image-${img.id} {
                                translate: ${-v.sx * 100}% ${-v.sy * 100}%;
                                width: ${((img.width * scale) / w) * 100}cqw;
                                height: ${((img.height * scale) / h) * 100}cqh;
                                max-width: none;
                                max-height: none;
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
            ...responsiveStyles(
                template.mobile.width,
                template.mobile.height,
                mobiles
            ),
            ...mobileExcludes.map(v =>
                `.item-${v.id} { display: none; }`
            )
        ]),
        atBreakpoint(
            template.tablet.width,
            join([
                ...responsiveStyles(
                    template.tablet.width,
                    template.tablet.height,
                    tablets
                ),
                ...tabletExcludes.map(v =>
                    `.item-${v.id} { display: none; }`
                )
            ])
        ),
        atBreakpoint(
            template.desktop.width,
            join([
                ...responsiveStyles(
                    template.desktop.width,
                    template.desktop.height,
                    desktops
                ),
                ...desktopExcludes.map(v =>
                    `.item-${v.id} { display: none; }`
                )
            ])
        )
    ].filter(v => v)

    const [largest] = (layout.at(0) ?? ([])).toSorted((a: Item, b: Item) => {
        return (b.w * b.h) - (a.w * a.h)
    })

    const lcp = largest ?? ({ id: '' })

    const formatAlt = (v: string) => `${v} Designed By ${domain}`

    return (
        <article className='flex flex-col items-center justify-center gap-y-30 py-5 w-full'>
            <header className='flex flex-col items-center justify-center gap-y-10 text-center whitespace-pre-wrap w-full'>
                <div className='flex flex-col items-center justify-center gap-y-5'>
                    <h1 className='font-serif text-2xl/relaxed md:text-3xl/relaxed max-w-2xs md:max-w-md capitalize'>{name}</h1>
                    <h2 className='font-serif text-sm/relaxed md:text-base/relaxed max-w-2xs md:max-w-sm capitalize'>{location}</h2>
                </div>
                <p className='font-sans font-semibold text-base md:text-lg slide-from-bottom max-w-2xs md:max-w-md xl:max-w-lg'>
                    {story}
                </p>
                <h3 className='font-serif text-sm/loose md:text-base/loose xl:text-lg/loose slide-from-bottom max-w-2xs md:max-w-lg xl:max-w-2xl'>
                    {tagline}
                </h3>
            </header>
            <div className='w-full layout' style={{ containerType: 'size' }}>
                {
                    layout.map((items, i) =>
                        <section key={i} className={`w-full section-${i}`}>
                            {
                                items.map(item => {
                                    const img = asset[item.src]
                                    return (
                                        <div
                                            key={item.id}
                                            className={`anim-delay-[125ms] item-${item.id}` + (item.effect ? ` ${item.effect}` : '')}
                                        >
                                            <Image
                                                className={`anim-delay-[125ms] size-80 image-${img.id}`}
                                                src={img.src}
                                                width={img.width}
                                                height={img.height}
                                                alt={formatAlt(img.alt)}
                                                priority={item.id === lcp.id}
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
