'use client'

import clsx from 'clsx'
import { brush, D3DragEvent, drag, select, xml } from 'd3'
import React, { PointerEvent, PointerEventHandler, useLayoutEffect, useRef, useState } from 'react'
import { Item, Layout, Template } from '@/type/editor'

type Subject = { x: number, y: number, container: { x: 0, y: 0, w: number, h: 0 }, item?: { x: number, y: number, w: number, h: number } }

type Box = { x: number, y: number, w: number, h: number }

type Handle = { container: { x: number, y: number, w: number, h: number }, sx: number, sy: number, item: { x: number, y: number, w: number, h: number } }

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

const Handle = ({ container, item, className = '', onChange, grid }: { item: React.RefObject<HTMLElement | null>, container: React.RefObject<HTMLElement | null>, grid: number, className: string, onChange: Function }) => {
    const ref = useRef<HTMLSpanElement>(null)

    useLayoutEffect(() => {
        const selection = select(ref.current!)

        selection.call(
            drag<HTMLSpanElement, unknown>()
                .container(() => container.current!)
                .subject(e => {
                    const parent = container.current!.getBoundingClientRect()
                    const box = item.current!.getBoundingClientRect()
                    return {
                        container: {
                            x: 0,
                            y: 0,
                            w: Math.round((parent.width) / grid),
                            h: Math.round((parent.height) / grid)
                        },
                        item: {
                            x: Math.round((box.x - parent.x) / grid),
                            y: Math.round((box.y - parent.y) / grid),
                            w: Math.round(box.width / grid),
                            h: Math.round(box.height / grid)
                        },
                        x: e.x,
                        y: e.y
                    }
                })
                .on('drag', (e: { subject: Subject, x: number, y: number }) =>
                    onChange({
                        sx: Math.round((e.x - e.subject.x) / grid),
                        sy: Math.round((e.y - e.subject.y) / grid),
                        item: e.subject.item,
                        container: e.subject.container
                    })
                )
        )
        return () => {
            selection.on('.drag', null)
        }
    }, [ grid ])

    return (
        <span ref={ ref } className={ className }></span>
    )
}


const Editable = ({ container, grid, src, item, active, onActiveChange, onChange }: { container: React.RefObject<HTMLElement | null>, active: boolean, onActiveChange: Function, grid: number, src: string, item: Item, onChange: Function }) => {
    const itemRef = useRef<HTMLDivElement>(null)
    const [ dragging, setDragging ] = useState(false)

    useLayoutEffect(() => {
        const selection = select(itemRef.current!)

        const onDragStart = () => onActiveChange(() => true)

        const onDrag = (e: { subject: Subject, x: number, y: number }) => {
            onChange((item: Item) => {
                const x = constrain(
                    0,
                    e.subject.container.w - item.w,
                    Math.round(e.x / grid)
                )
                const y = constrain(
                    0,
                    e.subject.container.h - item.h,
                    Math.round(e.y / grid)
                )
                return { ...item, x, y }
            })
            setDragging(true)
            onActiveChange(() => false)
        }
        const onDragEnd = () => {
            setDragging(false)
            onActiveChange(() => true)
        }

        selection.call(
            drag<HTMLDivElement, unknown>()
                .container(() => container.current!)
                .subject(e => {
                    const parent = container.current!.getBoundingClientRect()
                    const target = e.sourceEvent.target.getBoundingClientRect()
                    return {
                        container: {
                            x: 0,
                            y: 0,
                            w: Math.round(parent.width / grid),
                            h: Math.round(parent.height / grid)
                        },
                        x: target.x - parent.x,
                        y: target.y - parent.y
                    }
                })
                .on('start', onDragStart)
                .on('drag', onDrag)
                .on('end', onDragEnd)
        )

        return () => {
            selection.on('.drag', null)
        }
    }, [ grid ])


    const handles = [
        {
            style: 'top-0 left-[4px] right-[4px] h-[8px] -translate-y-[50%] opacity-0 cursor-n-resize', // top-center
            onChange: ({ sy, item, container }: Handle) => onChange((curr: Item) => {
                const k = -sy * 2
                const delta = constrain(
                    1 - Math.max(item.w, item.h),
                    container.w - item.w,
                    k
                )
                return applyBoxConstrain(container, {
                    ...curr,
                    x: item.x + delta * -.5,
                    y: item.y + delta * -1,
                    w: item.w + delta,
                    h: item.w + delta
                })
            })
        },
        {
            style: 'bottom-0 left-[4px] right-[4px] h-[8px] translate-y-[50%] opacity-0 cursor-s-resize', // bottom-center
            onChange: ({ sy, item, container }: Handle) => onChange((curr: Item) => {
                const k = sy * 2
                const delta = constrain(
                    1 - Math.max(item.w, item.h),
                    container.w - item.w,
                    k
                )
                return applyBoxConstrain(container, {
                    ...curr,
                    x: item.x + delta * -.5,
                    y: item.y,
                    w: item.w + delta,
                    h: item.w + delta
                })
            })
        },
        {
            style: 'left-0 top-[4px] bottom-[4px] w-[8px] -translate-x-[50%] opacity-0 cursor-w-resize', // left-center
            onChange: ({ sx, item, container }: Handle) => onChange((curr: Item) => {
                const k = -sx * 2
                const delta = constrain(
                    1 - Math.max(item.w, item.h),
                    container.w - item.w,
                    k
                )
                return applyBoxConstrain(container, {
                    ...curr,
                    x: item.x + delta * -1,
                    y: item.y + delta * -.5,
                    w: item.w + delta,
                    h: item.w + delta
                })
            })
        },
        {
            style: 'right-0 top-[4px] bottom-[4px] w-[8px] translate-x-[50%] opacity-0 cursor-e-resize', // right-center
            onChange: ({ sx, item, container }: Handle) => onChange((curr: Item) => {
                const k = sx * 2
                const delta = constrain(
                    1 - Math.max(item.w, item.h),
                    container.w - item.w,
                    k
                )
                return applyBoxConstrain(container, {
                    ...curr,
                    x: item.x,
                    y: item.y + delta * -.5,
                    w: item.w + delta,
                    h: item.w + delta
                })
            })
        },
        {
            style: 'left-0 top-0 cursor-nwse-resize size-2 -translate-x-[50%] -translate-y-[50%]', // top-left
            onChange: ({ sx, sy, item, container }: Handle) => onChange((curr: Item) => {
                const k = Math.max(sx * -1, sy * -1) * 2
                const delta = constrain(
                    1 - Math.max(item.w, item.h),
                    container.w - item.w,
                    k
                )
                return applyBoxConstrain(container, {
                    ...curr,
                    x: item.x + delta * -1,
                    y: item.y + delta * -1,
                    w: item.w + delta,
                    h: item.w + delta
                })
            })
        },
        {
            style: 'top-0 right-0 cursor-nesw-resize size-2 translate-x-[50%] -translate-y-[50%]', // top-right
            onChange: ({ sx, sy, item, container }: Handle) => onChange((curr: Item) => {
                const k = Math.max(sx, sy * -1)
                const delta = constrain(
                    1 - Math.max(item.w, item.h),
                    container.w - item.w,
                    k
                )
                return applyBoxConstrain(container, {
                    ...curr,
                    x: item.x,
                    y: item.y + delta * -1,
                    w: item.w + delta,
                    h: item.w + delta
                })
            })
        },
        {
            style: 'right-0 bottom-0 cursor-nwse-resize size-2 translate-x-[50%] translate-y-[50%]', // bottom-right
            onChange: ({ sx, sy, item, container }: Handle) => onChange((curr: Item) => {
                const k = Math.max(sx, sy) * 2
                const delta = constrain(
                    1 - Math.max(item.w, item.h),
                    container.w - item.w,
                    k
                )
                return applyBoxConstrain(container, {
                    ...curr,
                    x: item.x,
                    y: item.y,
                    w: item.w + delta,
                    h: item.w + delta
                })
            })
        },
        {
            style: 'bottom-0 left-0 cursor-nesw-resize size-2 -translate-x-[50%] translate-y-[50%]', // bottom-left
            onChange: ({ sx, sy, item, container }: Handle) => onChange((curr: Item) => {
                const k = Math.max(sx * -1, sy) * 2
                const delta = constrain(
                    1 - Math.max(item.w, item.h),
                    container.w - item.w,
                    k
                )
                return applyBoxConstrain(container, {
                    ...curr,
                    x: item.x + delta * -1,
                    y: item.y,
                    w: item.w + delta,
                    h: item.w + delta
                })
            })
        }
    ]

    const itemStyle = {
        transform: `translate(${item.x * grid}px, ${item.y * grid}px)`,
        width: item.w * grid + 'px',
        height: item.h * grid + 'px',
    }
    const imageStyle = {
        objectPosition: `${item.sx * 100}% ${item.sy * 100}%`
    }

    return (
        <div
            ref={ itemRef }
            className={
                clsx(
                    'absolute',
                    { 'outline-1 outline-blue-500 z-10': active },
                    { 'hover:outline-1 hover:outline-blue-500': !dragging }
                )
            }
            style={ itemStyle }
        >
            <img
                className='absolute size-full object-cover pointer-events-none'
                style={ imageStyle }
                src={ src }
            />
            {
                handles.map(({ style, onChange }, i) =>
                    <Handle
                        key={ i + src }
                        container={ container }
                        item={ itemRef }
                        grid={ grid }
                        className={
                            clsx(
                                'absolute',
                                { [ style ]: active },
                                { 'outline-1 outline-blue-500 bg-white': active }
                            )
                        }
                        onChange={ onChange }
                    />
                )
            }
        </div>
    )
}

const Canvas = ({
    className = '',
    items,
    children,
    width,
    height,
}: {
    items: Item[],
    children: React.ReactNode,
    width: number,
    height: number,
    className?: string
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const contextRef = useRef<CanvasRenderingContext2D | null | undefined>(null)

    const [ dpr, setDpr ] = useState(1)

    useLayoutEffect(() => {
        contextRef.current = canvasRef.current!.getContext('2d')
        const DPR = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`)
        const onDPRChange = () => setDpr(window.devicePixelRatio || 1)

        DPR.addEventListener('change', onDPRChange)

        return () => {
            DPR.removeEventListener('change', onDPRChange)
        }
    }, [])

    const cssDimension = { width: Math.floor(width) + 'px', height: Math.floor(height) + 'px' }

    const attDimension = { width: Math.floor(width * dpr), height: Math.floor(height * dpr) }

    return (
        <>
            <canvas
                className='absolute outline-1 outline-neutral-200'
                ref={ canvasRef }
                style={ cssDimension }
                { ...attDimension }
            />
            { children }
        </>
    )

}

export default ({ className = '', images, template, setTemplate }: { images: string[], className?: string | '', template: Template, setTemplate: Function }) => {
    const containerRef = useRef<HTMLElement>(null)
    const [ actives, setActives ] = useState(() => template.layout.items.map(_ => false))

    const width = template.breakpoint

    const grid = width / template.layout.cols

    const height = Math.round(template.layout.rows * grid)

    const onItemChange = (index: number) => (fn: (item: Item) => Item) => setTemplate((template: Template) => {
        return {
            ...template,
            layout: {
                ...template.layout,
                items: template.layout.items.with(
                    index,
                    fn(template.layout.items[ index ])
                )
            }
        }
    })

    const onActiveChange = (i: number) => (fn: (current: boolean) => boolean) => setActives(actives =>
        actives.map((previous, j) => i === j ? fn(previous) : false)
    )

    return (
        <section ref={ containerRef } style={ { width: width + 'px', height: height + 'px' } } className={ clsx('relative', className) }>
            <Canvas
                items={ template.layout.items }
                width={ width }
                height={ height }
            >
                {
                    template.layout.items.map(item =>
                        <Editable
                            key={ item.i }
                            container={ containerRef }
                            active={ actives[ item.i ] }
                            onActiveChange={ onActiveChange(item.i) }
                            src={ images[ item.i ] }
                            item={ item }
                            grid={ grid }
                            onChange={ onItemChange(item.i) }
                        />
                    )
                }
            </Canvas>
        </section>
    )
}