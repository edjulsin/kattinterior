'use client'

import clsx from 'clsx'
import { brush, D3DragEvent, drag, image, index, map, select, xml } from 'd3'
import React, { KeyboardEvent, MouseEventHandler, PointerEvent, PointerEventHandler, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Item, Layout, Template } from '@/type/editor'
import * as ContextMenu from '@radix-ui/react-context-menu'
import CropIcon from '@/public/crop.svg'
import { AccessibleIcon } from '@radix-ui/react-accessible-icon'
import percent from '@/utility/percent'
import precise from '@/utility/precise'
import { getActiveResourcesInfo } from 'process'

type Box = { x: number, y: number, w: number, h: number }

type Subject = { x: number, y: number, container: Box, item: Item, image: Box }

type Handle = { dx: number, dy: number, container: Box, item: Item, image: Box }

type IndexedBox = Box & { i: number }

type Rectangle = {
    x0: number,
    y0: number,
    x1: number,
    y1: number
}

const o = (a: Function, b: Function) => (c: any) => a(b(c))

const compose = (...fns: Function[]) => (...args: any[]) =>
    fns.slice(0, -1).reduceRight(
        (a, b) => b(a),
        fns[ fns.length - 1 ](...args)
    )

const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b)

const boxConstrain = (container: Box, item: Box) => {
    const dx0 = item.x - container.x
    const dx1 = (item.x + item.w) - (container.x + container.w)
    const dy0 = item.y - container.y
    const dy1 = (item.y + item.h) - (container.y + container.h)
    return {
        dx: dx1 > dx0 ? (dx0 + dx1) / 2 : Math.min(0, dx0) || Math.max(0, dx1),
        dy: dy1 > dy0 ? (dy0 + dy1) / 2 : Math.min(0, dy0) || Math.max(0, dy1)
    }
}

const constrain = (min: number, max: number, value: number) => Math.min(Math.max(min, value), max)

const applyBoxConstrain = (container: Box, item: Box) => {
    const { dx, dy } = boxConstrain(container, item)
    return {
        ...item,
        x: item.x - dx,
        y: item.y - dy,
    }
}

const generateItemBoxes = ({ container, item, image }: { container: HTMLElement, item: HTMLElement, image: HTMLElement }) => {
    const co = container.getBoundingClientRect()
    const it = item.getBoundingClientRect()
    const im = image.getBoundingClientRect()
    return {
        container: {
            x: 0,
            y: 0,
            w: co.width,
            h: co.height
        },
        item: {
            z: Number(item.dataset.z),
            x: it.x - co.x,
            y: it.y - co.y,
            w: it.width,
            h: it.height,
            sx: (it.x - im.x) / im.width,
            sy: (it.y - im.y) / im.height,
            sw: it.width / im.width,
            sh: it.height / im.height,
            bw: Number(item.dataset.bw),
            bh: Number(item.dataset.bh)
        },
        image: {
            x: im.x - co.x,
            y: im.y - co.y,
            w: im.width,
            h: im.height
        }
    }
}

const Handle = ({ container, item, image, className = '', onDragStart, onDrag, onDragEnd }: { image: React.RefObject<HTMLImageElement | null>, item: React.RefObject<HTMLElement | null>, container: React.RefObject<HTMLElement | null>, className: string, onDragStart: Function, onDrag: Function, onDragEnd: Function }) => {
    const ref = useRef<HTMLSpanElement>(null)

    useLayoutEffect(() => {
        const selection = select(ref.current!)

        const result = (e: { x: number, y: number, subject: Subject }) => ({
            dx: e.x - e.subject.x,
            dy: e.y - e.subject.y,
            image: e.subject.image,
            item: e.subject.item,
            container: e.subject.container
        })

        selection.call(
            drag<HTMLSpanElement, unknown>()
                .clickDistance(1)
                .container(() => container.current!)
                .subject(e => {
                    return {
                        ...generateItemBoxes({
                            container: container.current!,
                            item: item.current!,
                            image: image.current!
                        }),
                        x: e.x,
                        y: e.y
                    }
                })
                .on('start', o(onDragStart, result))
                .on('drag', o(onDrag, result))
                .on('end', o(onDragEnd, result))
        )
        return () => {
            selection.on('.drag', null)
        }
    }, [])

    return (
        <span ref={ ref } className={ className }></span>
    )
}

type EditableProps = {
    onContextMenu: Function,
    active: boolean,
    interactive: boolean,
    container: React.RefObject<HTMLElement | null>,
    image: HTMLImageElement,
    value: Item,
    onMoveStart: Function,
    onMove: Function,
    onMoveEnd: Function,
    onResizeStart: Function,
    onResize: Function,
    onResizeEnd: Function,
    onCropStart: Function,
    onCrop: Function,
    onCropEnd: Function,
    bringToFront: Function,
    sendToBack: Function,
    i: number,
    sizeExtent: number[][],
    translateExtent: number[][],
}

const snap = (grid: number, value: number) => Math.round(value / grid) * grid

const Editable = ({
    sizeExtent: [ [ wMin, wMax ], [ hMin, hMax ] ],
    translateExtent: [ [ xMin, xMax ], [ yMin, yMax ] ],
    i,
    active,
    interactive,
    onContextMenu,
    container,
    image,
    value,
    onMoveStart,
    onMove,
    onMoveEnd,
    onResizeStart,
    onResize,
    onResizeEnd,
    onCropStart,
    onCrop,
    onCropEnd,
    bringToFront,
    sendToBack
}: EditableProps) => {

    const itemRef = useRef<HTMLDivElement>(null)
    const imageRef = useRef<HTMLImageElement>(null)
    const [ cropMode, setCropMode ] = useState(false)

    useLayoutEffect(() => {
        const item = select(itemRef.current!)
        const image = select(imageRef.current!)

        const subject = (e: D3DragEvent<HTMLElement, any, any>) => ({
            ...generateItemBoxes({
                container: container.current!,
                item: itemRef.current!,
                image: imageRef.current!
            }),
            x: e.x,
            y: e.y
        })

        const onImageDrag = (e: { subject: Subject, x: number, y: number }) => {
            const { image, item } = e.subject
            const sx = constrain(0, 1 - (item.w / image.w), (item.x - (image.x + (e.x - e.subject.x))) / image.w)
            const sy = constrain(0, 1 - (item.h / image.h), (item.y - (image.y + (e.y - e.subject.y))) / image.h)
            return { ...item, sx, sy }
        }

        const onItemDrag = (e: { subject: Subject, x: number, y: number }) => {
            const { item } = e.subject
            const x = constrain(
                xMin,
                xMax - item.w,
                item.x + (e.x - e.subject.x)
            )
            const y = constrain(
                yMin,
                yMax,
                item.y + (e.y - e.subject.y)
            )
            return { ...item, x, y }
        }

        item.call(
            drag<HTMLDivElement, unknown>()
                .clickDistance(1)
                .container(() => container.current!)
                .subject(subject)
                .on('start', o(onMoveStart, onItemDrag))
                .on('drag', o(onMove, onItemDrag))
                .on('end', o(onMoveEnd, onItemDrag))
        )

        image.call(
            drag<HTMLImageElement, unknown>()
                .clickDistance(1)
                .container(() => container.current!)
                .subject(subject)
                .on('start', o(onCropStart, onImageDrag))
                .on('drag', o(onCrop, onImageDrag))
                .on('end', o(onCropEnd, onImageDrag))
        )

        return () => {
            item.on('.drag', null)
            image.on('.drag', null)
        }
    }, [])

    useEffect(() => () => setCropMode(false), [ active ])

    const resizers = [
        {
            style: 'top-0 left-[4px] right-[4px] h-[8px] -translate-y-[50%] opacity-0 cursor-n-resize', // top-center
            callback: ({ dy, item }: Handle) => {
                const ratio = item.w / item.h
                const delta = constrain(
                    Math.min(wMin - item.w, hMin - item.h),
                    Math.min(
                        (wMax - item.w) / ratio,
                        (hMax - item.h) * ratio
                    ),
                    -dy
                )

                return applyBoxConstrain({ x: xMin, y: yMin, w: xMax, h: yMax }, {
                    ...item,
                    x: item.x - delta * ratio * .5,
                    y: item.y - delta,
                    w: item.w + delta * ratio,
                    h: item.h + delta
                })
            }
        },
        {
            style: 'bottom-0 left-[4px] right-[4px] h-[8px] translate-y-[50%] opacity-0 cursor-s-resize', // bottom-center
            callback: ({ dy, item }: Handle) => {
                const ratio = item.w / item.h
                const delta = constrain(
                    Math.min(wMin - item.w, hMin - item.h),
                    Math.min(
                        (wMax - item.w) / ratio,
                        (hMax - item.h) * ratio
                    ),
                    dy
                )
                return applyBoxConstrain({ x: xMin, y: yMin, w: xMax, h: yMax }, {
                    ...item,
                    x: item.x + delta * ratio * -.5,
                    w: item.w + delta * ratio,
                    h: item.h + delta
                })
            }
        },
        {
            style: 'left-0 top-[4px] bottom-[4px] w-[8px] -translate-x-[50%] opacity-0 cursor-w-resize', // left-center
            callback: ({ dx, item }: Handle) => {
                const ratio = item.h / item.w
                const delta = constrain(
                    Math.min(wMin - item.w, hMin - item.h),
                    Math.min(wMax - item.w, hMax - item.h),
                    -dx
                )
                return applyBoxConstrain({ x: xMin, y: yMin, w: xMax, h: yMax }, {
                    ...item,
                    x: item.x + delta * -1,
                    y: item.y + delta * ratio * -.5,
                    w: item.w + delta,
                    h: item.h + delta * ratio
                })
            }
        },
        {
            style: 'right-0 top-[4px] bottom-[4px] w-[8px] translate-x-[50%] opacity-0 cursor-e-resize', // right-center
            callback: ({ dx, item }: Handle) => {
                const ratio = item.h / item.w
                const delta = constrain(
                    Math.min(wMin - item.w, hMin - item.h),
                    Math.min(wMax - item.w, hMax - item.h),
                    dx
                )
                return applyBoxConstrain({ x: xMin, y: yMin, w: xMax, h: yMax }, {
                    ...item,
                    x: item.x,
                    y: item.y + delta * ratio * -.5,
                    w: item.w + delta,
                    h: item.h + delta * ratio
                })
            }
        },
        {
            style: 'left-0 top-0 cursor-nwse-resize size-2 -translate-x-[50%] -translate-y-[50%] outline-1 outline-blue-500 bg-white', // top-left
            callback: ({ dx, dy, item }: Handle) => {
                const ratio = item.w / item.h
                const delta = constrain(
                    Math.min(wMin - item.w, hMin - item.h),
                    Math.min(
                        (wMax - item.w) / ratio,
                        (hMax - item.h) * ratio
                    ),
                    Math.max(dx * -1, dy * -1)
                )
                return applyBoxConstrain({ x: xMin, y: yMin, w: xMax, h: yMax }, {
                    ...item,
                    x: item.x + delta * ratio * -1,
                    y: item.y + delta * -1,
                    w: item.w + delta * ratio,
                    h: item.h + delta
                })
            }
        },
        {
            style: 'top-0 right-0 cursor-nesw-resize size-2 translate-x-[50%] -translate-y-[50%] outline-1 outline-blue-500 bg-white', // top-right
            callback: ({ dx, dy, item }: Handle) => {
                const ratio = item.w / item.h
                const delta = constrain(
                    Math.min(wMin - item.w, hMin - item.h),
                    Math.min(
                        (wMax - item.w) / ratio,
                        (hMax - item.h) * ratio
                    ),
                    Math.max(dx, dy * -1)
                )
                return applyBoxConstrain({ x: xMin, y: yMin, w: xMax, h: yMax }, {
                    ...item,
                    x: item.x,
                    y: item.y + delta * -1,
                    w: item.w + delta * ratio,
                    h: item.h + delta
                })
            }
        },
        {
            style: 'right-0 bottom-0 cursor-nwse-resize size-2 translate-x-[50%] translate-y-[50%] outline-1 outline-blue-500 bg-white', // bottom-right
            callback: ({ dx, dy, item }: Handle) => {
                const ratio = item.w / item.h
                const delta = constrain(
                    Math.min(wMin - item.w, hMin - item.h),
                    Math.min(
                        (wMax - item.w) / ratio,
                        (hMax - item.h) * ratio
                    ),
                    Math.max(dx, dy)
                )
                return applyBoxConstrain({ x: xMin, y: yMin, w: xMax, h: yMax }, {
                    ...item,
                    x: item.x,
                    y: item.y,
                    w: item.w + delta * ratio,
                    h: item.h + delta
                })
            }
        },
        {
            style: 'bottom-0 left-0 cursor-nesw-resize size-2 -translate-x-[50%] translate-y-[50%] outline-1 outline-blue-500 bg-white', // bottom-left
            callback: ({ dx, dy, item }: Handle) => {
                const ratio = item.w / item.h
                const delta = constrain(
                    Math.min(wMin - item.w, hMin - item.h),
                    Math.min(
                        (wMax - item.w) / ratio,
                        (hMax - item.h) * ratio
                    ),
                    Math.max(dx * -1, dy)
                )
                return applyBoxConstrain({ x: xMin, y: yMin, w: xMax, h: yMax }, {
                    ...item,
                    x: item.x + delta * ratio * -1,
                    y: item.y,
                    w: item.w + delta * ratio,
                    h: item.h + delta
                })
            }
        }
    ]

    const croppers = [
        {
            style: 'top-0 left-[4px] right-[4px] h-[8px] -translate-y-[50%] opacity-0 cursor-n-resize', // top-center
            callback: ({ dy, item, image }: Handle) => {
                const delta = constrain(
                    hMin - item.h,
                    Math.min(item.y - image.y, item.y - yMin),
                    -dy
                )
                const y = item.y - delta
                const h = item.h + delta
                const sy = (y - image.y) / image.h
                const sh = h / image.h
                return { ...item, y, h, sy, sh }
            }
        },
        {
            style: 'bottom-0 left-[4px] right-[4px] h-[8px] translate-y-[50%] opacity-0 cursor-s-resize', // bottom-center
            callback: ({ dy, item, image }: Handle) => {
                const delta = constrain(hMin - item.h, (image.y + image.h) - (item.y + item.h), dy)
                const h = item.h + delta
                const sh = h / image.h
                return { ...item, h, sh }
            }
        },
        {
            style: 'left-0 top-[4px] bottom-[4px] w-[8px] -translate-x-[50%] opacity-0 cursor-w-resize', // left-center
            callback: ({ dx, item, image }: Handle) => {
                const delta = constrain(wMin - item.w, Math.min(item.x - image.x, item.x - xMin), -dx)
                const x = item.x - delta
                const w = item.w + delta
                const sx = (x - image.x) / image.w
                const sw = w / image.w
                return { ...item, x, w, sx, sw }
            }
        },
        {
            style: 'right-0 top-[4px] bottom-[4px] w-[8px] translate-x-[50%] opacity-0 cursor-e-resize', // right-center
            callback: ({ dx, item, image }: Handle) => {
                const delta = constrain(wMin - item.w, Math.min((image.x + image.w) - (item.x + item.w), (xMin + xMax) - (item.x + item.w)), dx)
                const w = item.w + delta
                const sw = w / image.w
                return { ...item, w, sw }
            }
        },
        {
            style: 'left-0 top-0 cursor-nwse-resize size-2 -translate-x-[50%] -translate-y-[50%] outline-1 outline-red-500 bg-white', // top-left
            callback: ({ dx, dy, item, image }: Handle) => {
                const dh = constrain(wMin - item.w, Math.min(item.x - image.x, item.x - xMin), -dx)
                const dv = constrain(hMin - item.h, Math.min(item.y - image.y, item.y - yMin), -dy)
                const x = item.x - dh
                const w = item.w + dh
                const y = item.y - dv
                const h = item.h + dv
                const sx = (x - image.x) / image.w
                const sw = w / image.w
                const sy = (y - image.y) / image.h
                const sh = h / image.h
                return { ...item, x, w, y, h, sx, sw, sy, sh }
            }
        },
        {
            style: 'top-0 right-0 cursor-nesw-resize size-2 translate-x-[50%] -translate-y-[50%] outline-1 outline-red-500 bg-white', // top-right
            callback: ({ dx, dy, item, image }: Handle) => {
                const dh = constrain(wMin - item.w, Math.min((image.x + image.w) - (item.x + item.w), (xMin + xMax) - (item.x + item.w)), dx)
                const dv = constrain(hMin - item.h, Math.min(item.y - image.y, item.y - xMin), -dy)
                const y = item.y - dv
                const w = item.w + dh
                const h = item.h + dv
                const sy = (y - image.y) / image.h
                const sw = w / image.w
                const sh = h / image.h
                return { ...item, y, w, h, sw, sy, sh }
            }
        },
        {
            style: 'right-0 bottom-0 cursor-nwse-resize size-2 translate-x-[50%] translate-y-[50%] outline-1 outline-red-500 bg-white', // bottom-right
            callback: ({ dx, dy, item, image }: Handle) => {
                const dh = constrain(wMin - item.w, Math.min((image.x + image.w) - (item.x + item.w), (xMin + xMax) - (item.x + item.w)), dx)
                const dv = constrain(hMin - item.h, (image.y + image.h) - (item.y + item.h), dy)
                const w = item.w + dh
                const h = item.h + dv
                const sw = w / image.w
                const sh = h / image.h
                return { ...item, w, h, sw, sh }
            }
        },
        {
            style: 'bottom-0 left-0 cursor-nesw-resize size-2 -translate-x-[50%] translate-y-[50%] outline-1 outline-red-500 bg-white', // bottom-left
            callback: ({ dx, dy, item, image }: Handle) => {
                const dh = constrain(wMin - item.w, Math.min(item.x - image.x, item.x - xMin), -dx)
                const dv = constrain(hMin - item.h, (image.y + image.h) - (item.y + item.h), dy)
                const x = item.x - dh
                const w = item.w + dh
                const h = item.h + dv
                const sx = (x - image.x) / image.w
                const sw = w / image.w
                const sh = h / image.h
                return { ...item, x, w, h, sx, sw, sh }
            }
        }
    ]

    const imgWidth = image.naturalWidth
    const imgHeight = image.naturalHeight
    const imgScale = Math.max(
        value.w / (value.sw * imgWidth),
        value.h / (value.sh * imgHeight)
    )

    const sx = value.sx * imgWidth
    const sy = value.sy * imgHeight
    const sw = value.sw * imgWidth
    const sh = value.sh * imgHeight

    const actives = [
        'outline-1 outline-blue-500',
        'outline-1 outline-red-500'
    ]
    const hovers = [
        'hover:outline-1 hover:outline-blue-500',
        'hover:outline-1 hover:outline-red-500'
    ]

    return (
        <div
            ref={ itemRef }
            onContextMenu={ () => onContextMenu(value) }
            data-i={ i }
            data-z={ value.z }
            data-active={ active }
            data-bw={ value.bw }
            data-bh={ value.bh }
            className='absolute'
            style={ {
                transform: `translate(${value.x}px, ${value.y}px)`,
                width: value.w + 'px',
                height: value.h + 'px',
                zIndex: value.z + (active ? 10 : 0),
                pointerEvents: cropMode ? 'none' : 'auto'
            } }
        >
            <ContextMenu.Root>
                <ContextMenu.Trigger disabled={ cropMode } asChild>
                    <div className='relative size-full'>
                        <div
                            className='absolute size-full'
                            style={ { overflow: cropMode ? 'visible' : 'clip' } }
                        >
                            <img
                                ref={ imageRef }
                                className='relative max-w-none max-h-none'
                                width={ imgWidth }
                                height={ imgHeight }
                                style={ {
                                    transformOrigin: 'top left',
                                    transform: `scale(${imgScale}) translate(${-sx}px, ${-sy}px)`,
                                    mask: `
                                        linear-gradient(#000 0 0) ${sx}px ${sy}px/${sw}px ${sh}px no-repeat, 
                                        linear-gradient(rgba(0,0,0,0.5) 0 0) no-repeat
                                    `,
                                    pointerEvents: cropMode ? 'auto' : 'none'
                                } }
                                src={ image.src }
                            />
                        </div>
                        <div className={
                            clsx(
                                'absolute size-full',
                                { [ actives[ Number(cropMode) ] ]: active },
                                { [ hovers[ Number(cropMode) ] ]: interactive },
                            )
                        }>
                            {
                                (cropMode ? croppers : resizers).map(({ style, callback }, i) =>
                                    <Handle
                                        key={ i + (cropMode ? 'cropper' : 'resizer') }
                                        container={ container }
                                        item={ itemRef }
                                        image={ imageRef }
                                        className={ clsx('absolute invisible', { 'visible pointer-events-auto': active && interactive }, style) }
                                        onDragStart={ o(cropMode ? onCropStart : onResizeStart, callback) }
                                        onDrag={ o(cropMode ? onCrop : onResize, callback) }
                                        onDragEnd={ o(cropMode ? onCropEnd : onResizeEnd, callback) }
                                    />
                                )

                            }
                        </div>
                    </div>
                </ContextMenu.Trigger>
                <ContextMenu.Portal>
                    <ContextMenu.Content
                        className='
                            z-50
                            p-1
                            bg-white 
                            rounded-sm
                            font-sans 
                            text-sm 
                            font-semibold
                            ring-1
                            ring-neutral-200
                            *:rounded-sm
                            *:size-full
                            *:select-none
                            *:outline-none
                            *:data-[highlighted]:bg-neutral-200
                        '
                    >
                        <ContextMenu.Item className='px-2 py-1' onSelect={ () => setCropMode(true) }>
                            Crop Image
                        </ContextMenu.Item>
                        <ContextMenu.Separator className='bg-neutral-200 py-[.5px] my-1' />
                        <ContextMenu.Item className='px-2 py-1' onSelect={ () => bringToFront(value) }>
                            Bring to Front
                        </ContextMenu.Item>
                        <ContextMenu.Item className='px-2 py-1' onSelect={ () => sendToBack(value) }>
                            Send to Back
                        </ContextMenu.Item>
                    </ContextMenu.Content>
                </ContextMenu.Portal>
            </ContextMenu.Root>
        </div>
    )
}

const offsetX = ([ x, y ]: [ number, number ]): [ number, number ] => ([ Math.floor(x) + .5, Math.round(y) ])
const offsetY = ([ x, y ]: [ number, number ]): [ number, number ] => ([ Math.round(x), Math.floor(y) + .5 ])
const corners = ({ x, y, w, h }: Box) => ([
    [ x, y ],
    [ x + w, y ],
    [ x + w, y + h ],
    [ x, y + h ]
])

const center = ({ x, y, w, h }: Box) => ([ x + w * .5, y + h * .5 ])

const centers = ({ x, y, w, h }: Box) => ([
    [ x, y + h * .5 ],
    [ x + w * .5, y ],
    [ x + w, y + h * .5 ],
    [ x + w * .5, y + h ]
])
const eq = (a: number, b: number) => Math.round(a) === Math.round(b)

const toPoints = (item: Box) => ([ ...corners(item), center(item) ])

const intersections = ([ ax, ay ]: number[], points: number[][]): number[][][] => {
    if(points.length > 0) {
        const [ [ ix, iy ], ...xs ] = points
        const x = eq(ax, ix)
        const y = eq(ay, iy)
        if(x || y) {
            return [ [ [ ax, ay ], [ ix, iy ] ] ]
        } else {
            return intersections([ ax, ay ], xs)
        }
    } else {
        return []
    }
}

const removeDuplicateLines = (lines: number[][][], acc: number[][][]) => {
    if(lines.length > 0) {
        const [ x, ...xs ] = lines
        const duplicate = ([ , d ]: number[][], [ , f ]: number[][]) => {
            const [ g, h ] = d
            const [ i, j ] = f
            return eq(g, i) && eq(h, j)
        }
        const ys = xs.filter(y =>
            !duplicate(x, y)
        )
        return removeDuplicateLines(ys, [ ...acc, x ])
    } else {
        return acc
    }
}

const Group = ({ container, onDragStart, onDrag, onDragEnd, x0, y0, x1, y1 }: { container: React.RefObject<HTMLElement | null>, x0: number, y0: number, x1: number, y1: number, onDragStart: Function, onDrag: Function, onDragEnd: Function }) => {
    const ref = useRef<HTMLDivElement>(null)

    useLayoutEffect(() => {
        const element = ref.current!
        const selection = select(element)

        selection.call(
            drag<HTMLDivElement, unknown>()
                .container(container.current!)
                .clickDistance(1)
                .on('start', e => onDragStart(e))
                .on('drag', e => onDrag(e))
                .on('end', e => onDragEnd(e))
        )

        return () => {
            selection.on('.drag', null)
        }
    }, [])

    return (
        <div
            ref={ ref }
            className='absolute top-0 left-0 outline-1 outline-blue-500 z-20'
            style={ {
                transform: `translate(${x0}px, ${y0}px)`,
                width: (x1 - x0) + 'px',
                height: (y1 - y0) + 'px'
            } }
        />
    )
}

const itemsToGroup = (ox: number, oy: number, items: Item[] | Box[] | IndexedBox[]) => items.reduce((acc, curr) => ({
    x0: Math.min(acc.x0, curr.x + ox),
    y0: Math.min(acc.y0, curr.y + oy),
    x1: Math.max(acc.x1, curr.x + curr.w + ox),
    y1: Math.max(acc.y1, curr.y + curr.h + oy)
}), {
    x0: Infinity,
    y0: Infinity,
    x1: -Infinity,
    y1: -Infinity
})

export default ({ className = '', images, deleteImages, template, setTemplate }: { deleteImages: Function, images: HTMLImageElement[], className?: string | '', template: Template, setTemplate: Function }) => {
    const rootRef = useRef<HTMLElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const contextRef = useRef<CanvasRenderingContext2D>(null)
    const prevRef = useRef<Item>(null)
    const [ actives, setActives ] = useState<number[]>([])
    const [ interactive, setInteractive ] = useState(true)
    const [ [ pw, ph ], setParentSize ] = useState([ 0, 0 ])
    const [ dpr, setDpr ] = useState(1)
    const [ z, setZ ] = useState(0)

    const cssSize = { width: Math.round(pw) + 'px', height: Math.round(ph) + 'px' }

    const attSize = { width: Math.round(pw * dpr), height: Math.round(ph * dpr) }

    const resetCanvas = () => {
        const canvas = canvasRef.current!
        const context = contextRef.current!
        const dpr = window.devicePixelRatio

        context.clearRect(0, 0, canvas.width, canvas.height)
        context.setTransform(1, 0, 0, 1, 0, 0)
        context.scale(dpr, dpr)
    }

    const clearCanvas = () => {
        const canvas = canvasRef.current!
        const context = contextRef.current!

        context.clearRect(0, 0, canvas.width, canvas.height)
        context.setTransform(1, 0, 0, 1, 0, 0)
    }

    const drawBlueLines = (lines: number[][][]) => {
        const canvas = canvasRef.current!.getBoundingClientRect()
        const container = containerRef.current!.getBoundingClientRect()
        const context = contextRef.current!

        const ox = container.x - canvas.x
        const oy = container.y - canvas.y

        const blue = 'oklch(0.623 0.214 259.815)'

        resetCanvas()

        context.save()

        context.setLineDash([ 2, 2 ])
        context.strokeStyle = blue

        context.beginPath()
        context.rect(ox, oy, container.width, container.height)
        context.clip()

        lines.forEach(([ [ sx, sy ], [ ex, ey ] ]) => {
            const crisp = eq(sx, ex) ? offsetX : offsetY
            const start: [ number, number ] = crisp([ sx + ox, sy + oy ])
            const end: [ number, number ] = crisp([ ex + ox, ey + oy ])
            context.beginPath()
            context.moveTo(...start)
            context.lineTo(...end)
            context.stroke()
        })

        context.restore()

    }

    const drawOrangeLines = (lines: number[][][]) => {
        const canvas = canvasRef.current!.getBoundingClientRect()
        const container = containerRef.current!.getBoundingClientRect()
        const context = contextRef.current!

        const ox = container.x - canvas.x
        const oy = container.y - canvas.y

        const orange = 'oklch(0.705 0.213 47.604)'
        const path = new Path2D()

        lines.forEach(([ [ sx, sy ], [ ex, ey ] ]) => {
            const crisp = eq(sx, ex) ? offsetX : offsetY
            const start: [ number, number ] = crisp([ sx + ox, sy + oy ])
            const end: [ number, number ] = crisp([ ex + ox, ey + oy ])
            path.moveTo(...start)
            path.lineTo(...end)
        })

        resetCanvas()

        context.save()

        context.strokeStyle = orange

        context.beginPath()
        context.rect(ox, oy, container.width + 1, container.height + 1)
        context.clip()

        context.stroke(path)

        context.restore()
    }

    useLayoutEffect(() => {
        const root = rootRef.current!
        const canvas = canvasRef.current!
        const container = containerRef.current!
        const context = canvas.getContext('2d')!
        const rootSelection = select(root)

        const resizer = new ResizeObserver(() => {
            const { width, height } = root.getBoundingClientRect()
            setParentSize([ width, height ])
        })
        const dpr = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`)
        const onDPRChange = () => setDpr(window.devicePixelRatio || 1)

        const onDelete = (e: { key: string }) => {
            if(e.key === 'Delete') {
                const actives = [ ...container.children ].reduce<number[]>((a, b) => {
                    const item = b as HTMLDivElement
                    const active = item.dataset.active === 'true'
                    if(active) {
                        return [ ...a, Number(item.dataset.i) ]
                    } else {
                        return a
                    }
                }, [])

                setInteractive(true)
                setActives([])
                deleteImages(actives)
            }
        }

        contextRef.current = context
        resizer.observe(root)
        dpr.addEventListener('change', onDPRChange)
        document.addEventListener('keydown', onDelete)

        rootSelection.call(
            drag<HTMLElement, unknown>()
                .clickDistance(1)
                .container(root)
                .on('start', () => {
                    setZ(10)
                    setActives([])
                    setInteractive(false)
                })
                .on('drag', e => {
                    const x = Math.max(
                        1,
                        Math.round(
                            Math.min(e.subject.x, e.x)
                        )
                    )
                    const y = Math.max(
                        1,
                        Math.round(
                            Math.min(e.subject.y, e.y)
                        )
                    )
                    const w = Math.min(
                        Math.round(canvas.width) - 1,
                        Math.round(
                            Math.abs(e.subject.x - e.x)
                        )
                    )
                    const h = Math.min(
                        Math.round(canvas.height) - 1,
                        Math.round(
                            Math.abs(e.subject.y - e.y)
                        )
                    )

                    const c = canvas.getBoundingClientRect()
                    const childrens = [ ...container.children ]
                    const actives = childrens.reduce<number[]>((acc, curr) => {
                        const rect = curr.getBoundingClientRect()
                        const element = curr as HTMLDivElement
                        const l = rect.x - c.x
                        const t = rect.y - c.y
                        const r = l + rect.width
                        const b = t + rect.height
                        const xs =
                            constrain(x, x + w, l) === l ||
                            constrain(x, x + w, r) === r ||
                            constrain(l, r, x) === x ||
                            constrain(l, r, x + w) === x + w

                        const ys =
                            constrain(y, y + h, t) === t ||
                            constrain(y, y + h, b) === b ||
                            constrain(t, b, y) === y ||
                            constrain(t, b, y + h) === y + h

                        if(xs && ys) {
                            return acc.concat([ Number(element.dataset.i) ])
                        } else {
                            return acc
                        }
                    }, [])

                    setActives(actives)

                    const blue = 'oklch(0.623 0.214 259.815)'
                    const blueTransparent = 'oklch(0.623 0.214 259.815 / 5%)'

                    context.lineWidth = 1
                    context.strokeStyle = blue
                    context.fillStyle = blueTransparent

                    resetCanvas()

                    context.fillRect(x, y, w, h)
                    context.strokeRect(x + .5, y + .5, w, h)
                })
                .on('end', () => {
                    clearCanvas()
                    setZ(0)
                })
        )

        return () => {
            resizer.disconnect()
            document.removeEventListener('keydown', onDelete)
            dpr.removeEventListener('change', onDPRChange)
            rootSelection.on('.drag', null)
        }
    }, [])

    useLayoutEffect(() => () => {
        const prev = images.length
        const curr = containerRef.current!.children.length
        const diff = curr - prev

        const generate = (count: number, acc: number[]): number[] =>
            count > 0
                ? generate(count - 1, [ ...acc, acc.length ])
                : acc

        clearCanvas()

        if(diff > 0) {
            const actives = generate(diff, []).map((_, i) =>
                curr - (i + 1)
            )
            setInteractive(actives.length < 2)
            setActives(actives)
        }
    }, [ images.length ])

    const width = template.breakpoint

    const height = template.layout.rows * template.grid

    const applyChange = (index: number, item: Item) =>
        setTemplate((template: Template) => {
            const items = template.layout.items.with(index, item)
            const rows = Math.round(
                Math.max(
                    ...items.map(v => (v.y + v.h) / template.grid)
                )
            )
            return {
                ...template,
                layout: { ...template.layout, rows, items }
            }
        })

    const bringToFront = (index: number) => (item: Item) =>
        setTemplate((template: Template) => {
            const max = Math.max(
                ...template.layout.items.map(v => v.z)
            )
            const items = template.layout.items.with(index, { ...item, z: max + 1 })
            return {
                ...template,
                layout: { ...template.layout, items }
            }
        })

    const sendToBack = (index: number) => (item: Item) =>
        setTemplate((template: Template) => {
            return {
                ...template,
                layout: {
                    ...template.layout,
                    items: template.layout.items.with(index, { ...item, z: 0 })
                }
            }
        })

    const drawActiveLines = (item: Item) => {
        const cx = item.x + item.w * .5
        const cy = item.y + item.h * .5

        drawBlueLines([
            [ [ 0, cy ], [ item.x, cy ] ],
            [ [ cx, 0 ], [ cx, item.y ] ]
        ])
    }

    const onContextMenu = (index: number) => () => {
        setInteractive(true)
        setActives([ index ])
    }

    const calculateGroup = (items: Item[]): Rectangle => {
        const root = rootRef.current!.getBoundingClientRect()
        const container = containerRef.current!.getBoundingClientRect()
        const ox = container.x - root.x
        const oy = container.y - root.y
        return itemsToGroup(ox, oy, items)
    }

    const onGroupDragStart = () => setInteractive(false)

    const onGroupDrag = (e: { dx: number, dy: number }) => {
        const container = containerRef.current!
        const c = container.getBoundingClientRect()

        const [ actives, inactives ] = [ ...container.children ].reduce<IndexedBox[][]>(([ actives, inactives ], curr) => {
            const item = curr as HTMLDivElement
            const active = item.dataset.active === 'true'
            const i = Number(item.dataset.i)
            const r = item.getBoundingClientRect()
            const next = {
                i: i,
                x: r.x - c.x,
                y: r.y - c.y,
                w: r.width,
                h: r.height
            }
            if(active) {
                return [ actives.concat([ next ]), inactives ]
            } else {
                return [ actives, inactives.concat([ next ]) ]
            }
        }, [ [], [] ])

        const group = itemsToGroup(0, 0, actives)

        const constrainBox = {
            x: 0,
            y: 0,
            w: snap(template.grid, c.width),
            h: Infinity
        }

        const initial = {
            x: group.x0,
            y: group.y0,
            w: group.x1 - group.x0,
            h: group.y1 - group.y0
        }

        const moved = applyBoxConstrain(
            constrainBox,
            {
                x: initial.x + e.dx,
                y: initial.y + e.dy,
                w: initial.w,
                h: initial.h
            }
        )
        const snapped = applyBoxConstrain(
            constrainBox,
            {
                x: snap(template.grid, moved.x),
                y: snap(template.grid, moved.y),
                w: snap(template.grid, moved.w),
                h: snap(template.grid, moved.h)
            }
        )

        const canvas = centers({
            x: 0,
            y: 0,
            w: c.width,
            h: c.height
        })

        const points = toPoints(snapped)

        const lines = removeDuplicateLines(
            inactives.reduce(
                (acc, curr) => {
                    const lines = toPoints(curr)
                    const result = points.flatMap(point =>
                        intersections(point, lines)
                    )
                    return [ ...acc, ...result ]
                },
                points.flatMap(point =>
                    intersections(point, canvas)
                )
            ),
            []
        )

        const shouldSnap = lines.length > 0
        const dx = (shouldSnap ? snapped.x : moved.x) - initial.x
        const dy = (shouldSnap ? snapped.y : moved.y) - initial.y

        setTemplate((template: Template) => {
            const items = actives.reduce(
                (a, b) => {
                    const item = template.layout.items[ b.i ]
                    return a.with(b.i, {
                        ...item,
                        x: item.x + dx,
                        y: item.y + dy
                    })
                },
                template.layout.items
            )
            const rows = Math.round(
                Math.max(
                    ...items.map(v => (v.y + v.h) / template.grid)
                )
            )
            return {
                ...template,
                layout: { ...template.layout, items, rows }
            }
        })

        if(shouldSnap) {
            drawOrangeLines(lines)
        } else {
            clearCanvas()
        }
    }
    const onGroupDragEnd = (e: D3DragEvent<HTMLDivElement, any, any>) => {
        const dx = e.x - e.subject.x
        const dy = e.y - e.subject.y

        if(dx || dy) {
            clearCanvas()
            setTemplate((template: Template) => {
                const items = template.layout.items.map(v => {
                    return {
                        ...v,
                        x: snap(template.grid, v.x),
                        y: snap(template.grid, v.y),
                        w: snap(template.grid, v.w),
                        h: snap(template.grid, v.h)
                    }
                })
                const rows = Math.round(
                    Math.max(
                        ...items.map(v => (v.y + v.h) / template.grid)
                    )
                )
                return {
                    ...template,
                    layout: { ...template.layout, items, rows }
                }
            })
        } else {
            const container = containerRef.current!
            const c = container.getBoundingClientRect()
            const items = [ ...container.children ]
            const index = items.findIndex(v => {
                const r = v.getBoundingClientRect()
                const x = r.x - c.x
                const y = r.y - c.y
                const inside = constrain(x, x + r.width, e.x) === e.x && constrain(y, y + r.height, e.y) === e.y
                return inside
            })

            setInteractive(true)

            if(index < 0) {
                setActives([])
            } else {
                const el = items[ index ]
                const r = el.getBoundingClientRect()
                const element = el as HTMLDivElement
                const item = {
                    x: r.x - c.x,
                    y: r.y - c.y,
                    w: r.width,
                    h: r.height
                }
                const cx = item.x + item.w * .5
                const cy = item.y + item.h * .5

                setActives([ Number(element.dataset.i) ])
                drawBlueLines([
                    [ [ 0, cy ], [ item.x, cy ] ],
                    [ [ cx, 0 ], [ cx, item.y ] ]
                ])
            }
        }
    }

    const sizeExtent = [
        [ 15, template.breakpoint ],
        [ 15, Infinity ]
    ]

    const translateExtent = [
        [ 0, template.breakpoint ],
        [ 0, Infinity ]
    ]

    const onMoveStart = (index: number) => (item: Item) => {
        setInteractive(true)
        setActives([ index ])
        drawActiveLines(item)
    }

    const onMove = (index: number) => (item: Item) => {
        const snapped = {
            ...item,
            x: snap(template.grid, item.x),
            y: snap(template.grid, item.y),
            w: snap(template.grid, item.w),
            h: snap(template.grid, item.h)
        }

        const points = toPoints(snapped)

        const c = containerRef.current!.getBoundingClientRect()

        const canvas = centers({
            x: 0,
            y: 0,
            w: snap(template.grid, c.width),
            h: snap(template.grid, c.height)
        })

        const childrens = [ ...containerRef.current!.children ]

        const lines = removeDuplicateLines(
            childrens.reduce(
                (acc, curr) => {
                    const next = curr as HTMLDivElement
                    const i = Number(next.dataset.i)
                    const r = next.getBoundingClientRect()
                    const box = {
                        x: r.x - c.x,
                        y: r.y - c.y,
                        w: r.width,
                        h: r.height
                    }
                    if(index === i) {
                        return acc
                    } else {
                        const lines = toPoints(box)
                        const result = points.flatMap(point =>
                            intersections(point, lines)
                        )
                        return [ ...acc, ...result ]
                    }
                },
                points.flatMap(point =>
                    intersections(point, canvas)
                )
            ),
            []
        )

        const shouldSnap = lines.length > 0

        const result = shouldSnap ? snapped : item

        setInteractive(false)
        applyChange(index, result)

        if(shouldSnap) {
            drawOrangeLines(lines)
        } else {
            clearCanvas()
        }

    }

    const onMoveEnd = (index: number) => (item: Item) => {
        const result = {
            ...item,
            x: snap(template.grid, item.x),
            y: snap(template.grid, item.y)
        }
        applyChange(index, result)
        setInteractive(true)
        drawActiveLines(result)
    }

    const onResizeStart = (index: number) => (item: Item) => {
        prevRef.current = item
        setInteractive(false)
    }

    const onResize = (index: number) => (item: Item) => {
        applyChange(index, item)
        drawActiveLines(item)
    }

    const onResizeEnd = (index: number) => (item: Item) => {
        const sw = Math.round(item.w / (item.bw * template.grid))
        const sh = Math.round(item.h / (item.bh * template.grid))
        const prev = prevRef.current!
        const k = constrain(
            1,
            Math.floor(
                template.breakpoint / (item.bw * template.grid)
            ),
            Math.min(sw, sh)
        )

        const w = item.bw * k * template.grid
        const h = item.bh * k * template.grid

        const dw = w - item.w
        const dh = h - item.h

        const dx0 = eq(item.x, prev.x)
        const dy0 = eq(item.y, prev.y)
        const dx1 = eq(item.x + item.w, prev.x + prev.w)
        const dy1 = eq(item.y + item.h, prev.y + prev.h)

        const dx = dx0 ? 0 : dx1 ? -dw : -dw * .5
        const dy = dy0 ? 0 : dy1 ? -dh : -dh * .5

        const result = {
            ...item,
            ...applyBoxConstrain(
                { x: 0, y: 0, w: template.breakpoint, h: Infinity },
                {
                    x: snap(template.grid, item.x + dx),
                    y: snap(template.grid, item.y + dy),
                    w: w,
                    h: h
                }

            )
        }

        applyChange(index, result)
        setInteractive(true)
        drawActiveLines(result)
    }

    const onCropStart = (index: number) => (item: Item) => {
        setInteractive(false)
    }

    const onCrop = (index: number) => (item: Item) => {
        applyChange(index, item)
    }

    const onCropEnd = (index: number) => (item: Item) => {
        const x = Math.round((item.x + template.grid * .25) / template.grid)
        const y = Math.round((item.y + template.grid * .25) / template.grid)
        const w = Math.round((item.w - template.grid * .25) / template.grid)
        const h = Math.round((item.h - template.grid * .25) / template.grid)
        const ox = w % 2
        const oy = h % 2

        const box = {
            x: (x + ox) * template.grid,
            y: (y + oy) * template.grid,
            w: (w - ox) * template.grid,
            h: (h - oy) * template.grid
        }

        const iw = item.w / item.sw
        const ih = item.h / item.sh

        const image = {
            x: item.x - (item.sx * iw),
            y: item.y - (item.sy * ih),
            w: iw,
            h: ih
        }

        const source = {
            sx: (box.x - image.x) / image.w,
            sy: (box.y - image.y) / image.h,
            sw: box.w / image.w,
            sh: box.h / image.h
        }

        const rw = Math.round(box.w / template.grid)
        const rh = Math.round(box.h / template.grid)

        const divisor = gcd(rw, rh)

        const base = {
            bw: rw / divisor,
            bh: rh / divisor
        }

        const result = { ...item, ...box, ...source, ...base }

        applyChange(index, result)
        setInteractive(true)
    }

    return (
        <section
            ref={ rootRef }
            className={ clsx('relative size-full flex flex-col items-center', className) }
        >
            <div
                ref={ containerRef }
                className='outline-1 outline-neutral-200'
                style={ {
                    width: width + 'px',
                    height: height + 'px'
                } }
            >
                {
                    template.layout.items.map((item, i) =>
                        <Editable
                            i={ i }
                            key={ template.breakpoint + i }
                            container={ containerRef }
                            active={ actives.includes(i) }
                            interactive={ interactive }
                            image={ images[ i ] }
                            value={ item }
                            sizeExtent={ sizeExtent }
                            translateExtent={ translateExtent }
                            onContextMenu={ onContextMenu(i) }
                            bringToFront={ bringToFront(i) }
                            sendToBack={ sendToBack(i) }
                            onMoveStart={ onMoveStart(i) }
                            onMove={ onMove(i) }
                            onMoveEnd={ onMoveEnd(i) }
                            onCropStart={ onCropStart(i) }
                            onCrop={ onCrop(i) }
                            onCropEnd={ onCropEnd(i) }
                            onResizeStart={ onResizeStart(i) }
                            onResize={ onResize(i) }
                            onResizeEnd={ onResizeEnd(i) }
                        />
                    )
                }
            </div>
            <canvas
                ref={ canvasRef }
                className='pointer-events-none absolute bg-transparent'
                style={ { ...cssSize, zIndex: z || 'auto' } }
                { ...attSize }
            />
            {
                actives.length > 1
                    ? <Group
                        container={ containerRef }
                        onDragStart={ onGroupDragStart }
                        onDrag={ onGroupDrag }
                        onDragEnd={ onGroupDragEnd }
                        {
                        ...calculateGroup(
                            actives.map(i => template.layout.items[ i ])
                        )
                        }
                    />
                    : null
            }
        </section>
    )
}