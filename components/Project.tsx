import { Items, Project, Item, Photo } from '@/type/editor';
import { ab, alt, extent, getLayout, ys } from '@/utility/fn';
import Image from 'next/image';
import React from 'react';
import Intersection from './Intersection';

export default ({ name, location, story, tagline, assets, template }: Project) => {

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
        items.reduce((a, b) => ({ ...a, [ b.id ]: b }), {})

    const desktop = table(template.desktop.items)
    const tablet = table(template.tablet.items)
    const mobile = table(template.mobile.items)

    const desktops = layout.map(v =>
        v.filter(v => v.id in desktop).map(v => desktop[ v.id ])
    )

    const tablets = layout.map(v =>
        v.filter(v => v.id in tablet).map(v => tablet[ v.id ])
    )

    const mobiles = layout.map(v =>
        v.filter(v => v.id in mobile).map(v => mobile[ v.id ])
    )

    const getGaps = (rows: Items[]) => {
        if(rows.length > 0) {
            const [ initial ] = rows
            return ab(
                (a, b, c: number[]) => {
                    const x = Math.max(
                        ...extent(ys, a)
                    )
                    const y = Math.min(
                        ...extent(ys, b)
                    )
                    return [ ...c, y - x ]
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

    const desktopExcludes = [ ...template.tablet.items, ...template.mobile.items ]
        .filter(v => !(v.id in desktop))
        .reduce<Items>((a, b) => a.some(v => b.id === v.id) ? a : a.concat([ b ]), [])

    const tabletExcludes = [ ...template.desktop.items, ...template.mobile.items ]
        .filter(v => !(v.id in tablet))
        .reduce<Items>((a, b) => a.some(v => b.id === v.id) ? a : a.concat([ b ]), [])

    const mobileExcludes = [ ...template.desktop.items, ...template.tablet.items ]
        .filter(v => !(v.id in mobile))
        .reduce<Items>((a, b) => a.some(v => b.id === v.id) ? a : a.concat([ b ]), [])

    const asset = Object.fromEntries(
        assets.map(v => {
            return [ v.id, v ]
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
                const [ sy, ey ] = extent(ys, row)
                const gap = gaps[ i ]
                const height = (ey - sy) + gap
                const section = `
                    .section-${i} {
                        height: ${(height / h) * 100}%;
                    }
                `

                return [
                    section,
                    ...row.flatMap(v => {
                        const item = `
                            .item-${v.id} {
                                display: block;
                                z-index: ${v.z};
                                left: ${(v.x / w) * 100}%;
                                top: ${(((v.y - sy) + gap) / height) * 100}%;
                                width: ${(v.w / w) * 100}cqw;
                                height: ${(v.h / h) * 100}cqh;
                            }
                        `
                        const img = asset[ v.src ]
                        const scale = Math.max(
                            v.w / (v.sw * img.width),
                            v.h / (v.sh * img.height)
                        )
                        const image = `
                            .image-${img.id} {
                                translate: ${-v.sx * 100}% ${-v.sy * 100}%;
                                width: ${((img.width * scale) / w) * 100}cqw;
                                height: ${((img.height * scale) / h) * 100}cqh;
                            }   
                        `
                        return [ item, image ].filter(v => v)
                    })
                ]
            })
        ]
    }

    const styles = [
        atBreakpoint(
            template.mobile.width,
            join([
                ...responsiveStyles(
                    template.mobile.width,
                    template.mobile.height,
                    mobiles
                ),
                ...mobileExcludes.map(v =>
                    `.item-${v.id} { display: none; }`
                )
            ])
        ),
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

    const generateSize = (width: number, item: Item, image: Photo) => {
        const scale = Math.max(
            item.w / (item.sw * image.width),
            item.h / (item.sh * image.height)
        )
        return `(max-width: ${width}px) ${((image.width * scale) / width) * 100}vw`
    }

    const onIntersect = (entries: IntersectionObserverEntry[]) =>
        entries.forEach(entry => {
            const el = entry.target as HTMLElement
            const intersecting = entry.isIntersecting ? 'true' : 'false'
            const done = el.dataset.done === 'true' ? 'true' : intersecting

            el.dataset.done = done
            el.dataset.intersecting = intersecting
        })

    return ( // should use either desktop, tablet, or mobile by default to avoid mess on initial render or maybe wait unti production build
        <Intersection
            selectors={ [
                '.story',
                '.tagline',
                ...layout.flatMap(items =>
                    items.filter(v => v.effect).map(v => '.item-' + v.id)
                )
            ] }
            options={ { threshold: 0.5 } }
            callback={ onIntersect }
        >
            <article className='flex flex-col items-center justify-center gap-y-20 py-20'>
                <header className='flex flex-col items-center justify-center gap-y-10 max-w-3xl text-center whitespace-pre-wrap *:w-full px-10'>
                    <div className='flex flex-col items-center justify-center gap-y-5'>
                        <h1 className='name font-serif text-2xl'>{ name }</h1>
                        <h2 className='location font-serif text-sm'>{ location }</h2>
                    </div>
                    <div className='flex flex-col items-center justify-center gap-y-10'>
                        <p
                            data-done={ false }
                            data-intersecting={ false }
                            className='story font-sans font-semibold max-w-lg text-lg'
                        >
                            { story }
                        </p>
                        <h3
                            data-done={ false }
                            data-intersecting={ false }
                            className='tagline font-serif text-lg leading-9'
                        >
                            { tagline }
                        </h3>
                    </div>
                </header>
                <div className={ `w-full layout` } style={ { containerType: 'size' } }>
                    {
                        layout.map((items, i) =>
                            <section key={ i } className={ `section-${i} w-full relative` }>
                                {
                                    items.map(item => {
                                        const img = asset[ item.src ]
                                        const small = item.id in mobile ? generateSize(template.mobile.width, mobile[ item.id ], img) : ''
                                        const medium = item.id in tablet ? generateSize(template.tablet.width, tablet[ item.id ], img) : ''
                                        const large = item.id in desktop ? generateSize(template.desktop.width, desktop[ item.id ], img) : ''
                                        const sizes = [ small, medium, large ].filter(v => v).join(', ')
                                        return (
                                            <div
                                                key={ item.id }
                                                className={ `item-${item.id} absolute overflow-clip` + (item.effect ? ` ${item.effect}` : '') }
                                                data-done={ false }
                                                data-intersecting={ false }
                                                data-scroll-x={ 0 }
                                                data-scroll-y={ 0 }
                                            >
                                                <Image
                                                    className={ `relative image-${img.id} max-w-none max-h-none` }
                                                    src={ img.src }
                                                    width={ img.width }
                                                    height={ img.height }
                                                    alt={ alt(img.alt) }
                                                    sizes={ sizes }
                                                />
                                            </div>
                                        )
                                    })
                                }
                            </section>
                        )
                    }
                    <style jsx>{ `${join(styles)}` }</style>
                </div>
            </article>
        </Intersection>
    )
}