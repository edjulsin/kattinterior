/* eslint-disable @typescript-eslint/no-unused-vars */

'use client'

import clsx from 'clsx'
import { drag, select } from 'd3'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Item, Photo, Layout, Asset, Items, Box, Extent, Point } from '@/type/editor'
import { ContextMenu, Dialog } from 'radix-ui'
import { applyBoxConstrain, capitalize, clamp, curry, o, alt as alternative, half, getItemsHeight, isInsideBox, generateItemBoxes, resize, bottomCenter, topCenter, rightCenter, leftCenter, bottomRight, bottomLeft, topLeft, topRight, crop, eq, splitChildrenAsBoxes, isBoxesIntersect, snap, snapLines, centers } from '@/utility/fn'
import { DragPropsType, useDrag, UseDragBehavior, UseDragEvent } from '@/hook/useDrag'
import { v7 as UUIDv7 } from 'uuid'
import { ChevronRightIcon } from '@radix-ui/react-icons'
import Fallback from '@/assets/fallback.svg'
import Image from 'next/image'

const brand = process.env.NEXT_PUBLIC_SITE_NAME

type Result = {
    dx: number,
    dy: number,
    image: Box,
    item: Item,
    container: Box
}

type Rectangle = {
    x0: number,
    y0: number,
    x1: number,
    y1: number
}

type ItemCallback = (item: Item) => void

type ImageCallback = (image: Photo) => void

const effects = [
    'scale-up',
    'scale-down',
    'parallax',
    'slide-from-left',
    'slide-from-right',
    'slide-from-top',
    'slide-from-bottom'
]

type EditableProps = {
    onContextMenu: ItemCallback,
    active: boolean,
    interactive: boolean,
    container: React.RefObject<HTMLElement | null>,
    image: Photo,
    value: Item,
    onMoveStart: ItemCallback,
    onMove: ItemCallback,
    onMoveEnd: ItemCallback,
    onResizeStart: ItemCallback,
    onResize: ItemCallback,
    onResizeEnd: ItemCallback,
    onCropStart: ItemCallback,
    onCrop: ItemCallback,
    onCropEnd: ItemCallback,
    onDuplicate: ItemCallback,
    onEffect: ItemCallback,
    bringToFront: ItemCallback,
    sendToBack: ItemCallback,
    setAsThumbnail: ImageCallback,
    setImageAlt: ImageCallback,
    sizeExtent: Extent,
    translateExtent: Extent,
}

const offsetX = ([x, y]: Point): Point => ([Math.floor(x) + .5, Math.round(y)])
const offsetY = ([x, y]: Point): Point => ([Math.round(x), Math.floor(y) + .5])

const eventTransformer = <T extends HTMLElement>(e: UseDragEvent<T>): Result => ({
    dx: e.x - e.subject.x,
    dy: e.y - e.subject.y,
    image: e.subject.image,
    item: e.subject.item,
    container: e.subject.container
})

const Handle = ({ className, ...rest }: DragPropsType<HTMLSpanElement> & { className: string }) =>
    <span
        ref={useDrag<HTMLSpanElement>({ ...rest })}
        data-testid='handle'
        className={className}
    />

const EditDescription = ({ onSave, open, onOpenChange }: { onSave: (alt: string) => void, open: boolean, onOpenChange: (v: boolean) => void }) => {
    const [alt, setAlt] = useState('')
    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Portal>
                <Dialog.Overlay className='z-50 fixed inset-0 bg-neutral-300/50' />
                <Dialog.Content
                    className='
                    flex
                    flex-col
                    gap-y-1
                    justify-center
                    font-sans 
                    fixed 
                    top-[50%] 
                    left-[50%] 
                    -translate-x-[50%] 
                    -translate-y-[50%] 
                    min-w-2xs 
                    rounded-md 
                    ring-1
                    ring-neutral-200
                    px-5
                    py-3
                    bg-light
                    dark:bg-dark
                    z-50
                '
                >
                    <Dialog.Title className='font-bold text-lg'>Edit description</Dialog.Title>
                    <Dialog.Description className='font-semibold text-base opacity-50'>
                        Short description about the image.
                    </Dialog.Description>
                    <fieldset className='py-3'>
                        <label htmlFor='alt' className='sr-only'>Description</label>
                        <input
                            id='alt'
                            autoFocus={true}
                            className='px-2 py-1 rounded-md outline-1 outline-neutral-200 transition-colors focus:outline-amber-600 w-full font-semibold text-base'
                            value={alt}
                            onChange={v => setAlt(v.target.value)}
                            type='text'
                            placeholder='e.g., Scandinavian chair'
                        />
                    </fieldset>
                    <Dialog.Close
                        className='text-center font-bold text-base rounded-md cursor-pointer px-2 py-1 transition-colors hover:bg-amber-600 hover:text-light w-full'
                        onClick={() => onSave(alt)}
                    >
                        Save changes
                    </Dialog.Close>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}

const Editable = ({
    sizeExtent,
    translateExtent,
    onDuplicate,
    onEffect,
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
    sendToBack,
    setAsThumbnail,
    setImageAlt
}: EditableProps) => {
    const [cropMode, setCropMode] = useState(false)
    const [dialog, setDialog] = useState(false)
    const [error, setError] = useState(false)

    const [[xMin, xMax], [yMin, yMax]] = translateExtent

    const modifier = <T extends HTMLElement>(drag: UseDragBehavior<T>) =>
        drag
            .clickDistance(1)
            .container(() => container.current!)
            .subject((e: { x: number, y: number }) => {
                return {
                    ...generateItemBoxes({
                        container: container.current!,
                        item: itemRef.current!,
                        image: imageRef.current!
                    }),
                    x: e.x,
                    y: e.y,
                }
            })

    const onItem = (e: Result): Item => {
        const x = clamp(
            xMin,
            xMax - e.item.w,
            e.item.x + e.dx
        )
        const y = clamp(
            yMin,
            yMax - e.item.h,
            e.item.y + e.dy
        )
        return { ...e.item, x, y }
    }

    const onImage = (e: Result): Item => {
        const sx = clamp(0, 1 - (e.item.w / e.image.w), (e.item.x - (e.image.x + e.dx)) / e.image.w)
        const sy = clamp(0, 1 - (e.item.h / e.image.h), (e.item.y - (e.image.y + e.dy)) / e.image.h)
        return { ...e.item, sx, sy }
    }

    const itemRef = useDrag<HTMLDivElement>({
        modifier: modifier,
        transform: eventTransformer,
        onDragStart: o(onMoveStart, onItem),
        onDrag: o(onMove, onItem),
        onDragEnd: o(onMoveEnd, onItem)
    })

    const imageRef = useDrag<HTMLImageElement>({
        modifier: modifier,
        transform: eventTransformer,
        onDragStart: o(onCropStart, onImage),
        onDrag: o(onCrop, onImage),
        onDragEnd: o(onCropEnd, onImage)
    })

    useEffect(() => () => setCropMode(false), [active])

    const resizers = [
        {
            style: 'top-0 left-[4px] right-[4px] h-[8px] -translate-y-[50%] opacity-0 cursor-n-resize', // top-center
            callback: ({ dy, item }: Result): Item =>
                resize(
                    sizeExtent,
                    translateExtent,
                    bottomCenter(item),
                    1 + -dy / item.h,
                    item
                )
        },
        {
            style: 'bottom-0 left-[4px] right-[4px] h-[8px] translate-y-[50%] opacity-0 cursor-s-resize', // bottom-center
            callback: ({ dy, item }: Result): Item =>
                resize(
                    sizeExtent,
                    translateExtent,
                    topCenter(item),
                    1 + dy / item.h,
                    item
                )
        },
        {
            style: 'left-0 top-[4px] bottom-[4px] w-[8px] -translate-x-[50%] opacity-0 cursor-w-resize', // left-center
            callback: ({ dx, item }: Result): Item =>
                resize(
                    sizeExtent,
                    translateExtent,
                    rightCenter(item),
                    1 + -dx / item.w,
                    item
                )
        },
        {
            style: 'right-0 top-[4px] bottom-[4px] w-[8px] translate-x-[50%] opacity-0 cursor-e-resize', // right-center
            callback: ({ dx, item }: Result): Item =>
                resize(
                    sizeExtent,
                    translateExtent,
                    leftCenter(item),
                    1 + dx / item.w,
                    item
                )
        },
        {
            style: 'left-0 top-0 cursor-nwse-resize size-2 -translate-x-[50%] -translate-y-[50%] outline-1 outline-blue-500 bg-white', // top-left
            callback: ({ dx, dy, item }: Result): Item =>
                resize(
                    sizeExtent,
                    translateExtent,
                    bottomRight(item),
                    1 + Math.max(-dx / item.w, -dy / item.h),
                    item
                )
        },
        {
            style: 'top-0 right-0 cursor-nesw-resize size-2 translate-x-[50%] -translate-y-[50%] outline-1 outline-blue-500 bg-white', // top-right
            callback: ({ dx, dy, item }: Result): Item =>
                resize(
                    sizeExtent,
                    translateExtent,
                    bottomLeft(item),
                    1 + Math.max(dx / item.w, -dy / item.h),
                    item
                )
        },
        {
            style: 'right-0 bottom-0 cursor-nwse-resize size-2 translate-x-[50%] translate-y-[50%] outline-1 outline-blue-500 bg-white', // bottom-right
            callback: ({ dx, dy, item }: Result): Item =>
                resize(
                    sizeExtent,
                    translateExtent,
                    topLeft(item),
                    1 + Math.max(dx / item.w, dy / item.h),
                    item
                )
        },
        {
            style: 'bottom-0 left-0 cursor-nesw-resize size-2 -translate-x-[50%] translate-y-[50%] outline-1 outline-blue-500 bg-white', // bottom-left
            callback: ({ dx, dy, item }: Result): Item =>
                resize(
                    sizeExtent,
                    translateExtent,
                    topRight(item),
                    1 + Math.max(-dx / item.w, dy / item.h),
                    item
                )
        }
    ]

    const croppers = [
        {
            style: 'top-0 left-[4px] right-[4px] h-[8px] -translate-y-[50%] opacity-0 cursor-n-resize', // top-center
            callback: ({ dy, item, image }: Result): Item =>
                crop(
                    sizeExtent,
                    translateExtent,
                    bottomCenter(item),
                    1,
                    1 + -dy / item.h,
                    image,
                    item
                )
        },
        {
            style: 'bottom-0 left-[4px] right-[4px] h-[8px] translate-y-[50%] opacity-0 cursor-s-resize', // bottom-center
            callback: ({ dy, item, image }: Result): Item =>
                crop(
                    sizeExtent,
                    translateExtent,
                    topCenter(item),
                    1,
                    1 + dy / item.h,
                    image,
                    item
                )
        },
        {
            style: 'left-0 top-[4px] bottom-[4px] w-[8px] -translate-x-[50%] opacity-0 cursor-w-resize', // left-center
            callback: ({ dx, item, image }: Result): Item =>
                crop(
                    sizeExtent,
                    translateExtent,
                    rightCenter(item),
                    1 + -dx / item.w,
                    1,
                    image,
                    item
                )
        },
        {
            style: 'right-0 top-[4px] bottom-[4px] w-[8px] translate-x-[50%] opacity-0 cursor-e-resize', // right-center
            callback: ({ dx, item, image }: Result): Item =>
                crop(
                    sizeExtent,
                    translateExtent,
                    leftCenter(item),
                    1 + dx / item.w,
                    1,
                    image,
                    item
                )
        },
        {
            style: 'left-0 top-0 cursor-nwse-resize size-2 -translate-x-[50%] -translate-y-[50%] outline-1 outline-red-500 bg-white', // top-left
            callback: ({ dx, dy, item, image }: Result): Item =>
                crop(
                    sizeExtent,
                    translateExtent,
                    bottomRight(item),
                    1 + -dx / item.w,
                    1 + -dy / item.h,
                    image,
                    item
                )
        },
        {
            style: 'top-0 right-0 cursor-nesw-resize size-2 translate-x-[50%] -translate-y-[50%] outline-1 outline-red-500 bg-white', // top-right
            callback: ({ dx, dy, item, image }: Result): Item =>
                crop(
                    sizeExtent,
                    translateExtent,
                    bottomLeft(item),
                    1 + dx / item.w,
                    1 + -dy / item.h,
                    image,
                    item
                )
        },
        {
            style: 'right-0 bottom-0 cursor-nwse-resize size-2 translate-x-[50%] translate-y-[50%] outline-1 outline-red-500 bg-white', // bottom-right
            callback: ({ dx, dy, item, image }: Result): Item =>
                crop(
                    sizeExtent,
                    translateExtent,
                    topLeft(item),
                    1 + dx / item.w,
                    1 + dy / item.h,
                    image,
                    item
                )
        },
        {
            style: 'bottom-0 left-0 cursor-nesw-resize size-2 -translate-x-[50%] translate-y-[50%] outline-1 outline-red-500 bg-white', // bottom-left
            callback: ({ dx, dy, item, image }: Result): Item =>
                crop(
                    sizeExtent,
                    translateExtent,
                    topRight(item),
                    1 + -dx / item.w,
                    1 + dy / item.h,
                    image,
                    item
                )
        }
    ]

    const imgScale = Math.max(
        value.w / (value.sw * image.width),
        value.h / (value.sh * image.height)
    )

    const sx = value.sx * image.width
    const sy = value.sy * image.height
    const sw = value.sw * image.width
    const sh = value.sh * image.height

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
            ref={itemRef}
            className='absolute'
            onContextMenu={() => onContextMenu(value)}
            data-id={value.id}
            data-z={value.z}
            data-src={value.src}
            data-active={active}
            data-effect={value.effect}
            data-testid='editable'
            style={{
                transform: `translate(${value.x}px, ${value.y}px)`,
                width: value.w + 'px',
                height: value.h + 'px',
                zIndex: value.z + (active ? 10 : 0),
                pointerEvents: cropMode ? 'none' : 'auto'
            }}
        >
            <ContextMenu.Root>
                <ContextMenu.Trigger disabled={cropMode} asChild>
                    <div className='relative size-full'>
                        <div
                            className='absolute size-full'
                            style={{ overflow: cropMode ? 'visible' : 'clip' }}
                        >
                            {
                                error
                                    ? <img
                                        ref={imageRef}
                                        className='size-full object-cover object-center'
                                        width={1000}
                                        height={1000}
                                        alt='Image not found. Please delete and reupload.'
                                        src={Fallback.src}
                                    />
                                    : <Image
                                        ref={imageRef}
                                        className='relative max-w-none max-h-none select-none'
                                        src={image.src}
                                        width={image.width}
                                        height={image.height}
                                        alt={`${alternative(image.alt)} Designed By ${brand}`}
                                        onError={() => setError(true)}
                                        style={{
                                            transformOrigin: 'top left',
                                            transform: `scale(${imgScale}) translate(${-sx}px, ${-sy}px)`,
                                            mask: `
                                                linear-gradient(#000 0 0) ${sx}px ${sy}px/${sw}px ${sh}px no-repeat, 
                                                linear-gradient(rgba(0,0,0,0.5) 0 0) no-repeat
                                            `,
                                            pointerEvents: cropMode ? 'auto' : 'none'
                                        }}
                                    />
                            }
                        </div>
                        <div className={
                            clsx(
                                'absolute size-full',
                                { [actives[Number(cropMode)]]: active },
                                { [hovers[Number(cropMode)]]: interactive }
                            )
                        }>
                            {
                                (cropMode ? croppers : resizers).map(({ style, callback }, i) =>
                                    <Handle
                                        key={i + (cropMode ? 'cropper' : 'resizer')}
                                        className={clsx('absolute invisible', { 'visible pointer-events-auto': active && interactive }, style)}
                                        modifier={modifier}
                                        onDragStart={o(cropMode ? onCropStart : onResizeStart, callback)}
                                        onDrag={o(cropMode ? onCrop : onResize, callback)}
                                        onDragEnd={o(cropMode ? onCropEnd : onResizeEnd, callback)}
                                        transform={eventTransformer}
                                    />
                                )
                            }
                        </div>
                    </div>
                </ContextMenu.Trigger>
                <ContextMenu.Portal>
                    <ContextMenu.Content
                        className='
                            flex
                            flex-col
                            gap-y-0.5
                            z-50
                            p-1
                            bg-light 
                            dark:bg-dark
                            rounded-sm
                            font-sans 
                            text-sm 
                            font-semibold
                            ring-1
                            ring-neutral-200
                            shadow-xs
                            *:rounded-sm
                            *:size-full
                            *:select-none
                            *:outline-transparent
                            *:data-highlighted:bg-amber-600
                            *:data-highlighted:text-light
                            *:data-[state=open]:bg-amber-600
                            *:data-[state=open]:text-light
                            *:data-disabled:opacity-50
                            *:data-disabled:cursor-not-allowed
                        '
                        onContextMenu={e => e.stopPropagation()}
                    >
                        <ContextMenu.Item data-testid='crop' className='px-3 py-1.5' onSelect={() => setCropMode(true)}>
                            Crop Image
                        </ContextMenu.Item>
                        <ContextMenu.Separator className='bg-neutral-200 py-[.5px] my-1' />
                        <ContextMenu.Item
                            disabled={image.thumbnail}
                            className='px-3 py-1.5'
                            onSelect={() => setAsThumbnail({ ...image, thumbnail: true })}
                        >
                            Set as Thumbnail
                        </ContextMenu.Item>
                        <ContextMenu.Item className='px-3 py-1.5' onSelect={() => setDialog(true)}>
                            Set Image Description
                        </ContextMenu.Item>
                        <ContextMenu.Separator className='bg-neutral-200 py-[.5px] my-1' />
                        <ContextMenu.Item className='px-3 py-1.5' onSelect={() => bringToFront({ ...value, z: value.z + 1 })}>
                            Bring to Front
                        </ContextMenu.Item>
                        <ContextMenu.Item className='px-3 py-1.5' onSelect={() => sendToBack({ ...value, z: value.z - 1 })}>
                            Send to Back
                        </ContextMenu.Item>
                        <ContextMenu.Separator className='bg-neutral-200 py-[.5px] my-1' />
                        <ContextMenu.Sub>
                            <ContextMenu.SubTrigger className='flex justify-between items-center px-3 py-1.5'>
                                <span>Effects</span>
                                <span>
                                    <ChevronRightIcon />
                                </span>
                            </ContextMenu.SubTrigger>
                            <ContextMenu.Portal>
                                <ContextMenu.SubContent
                                    onContextMenu={e => e.stopPropagation()}
                                    sideOffset={5}
                                    alignOffset={-4}
                                    asChild
                                >
                                    <ContextMenu.RadioGroup
                                        value={value.effect}
                                        onValueChange={effect => onEffect({ ...value, effect })}
                                        className='
                                            flex
                                            flex-col
                                            gap-y-0.5
                                            z-50
                                            p-1
                                            bg-light 
                                            dark:bg-dark
                                            rounded-sm
                                            font-sans 
                                            text-sm 
                                            font-semibold
                                            ring-1
                                            ring-neutral-200
                                            *:rounded-sm
                                            *:size-full
                                            *:select-none
                                            *:outline-transparent
                                            *:data-highlighted:bg-amber-600
                                            *:data-highlighted:text-light
                                            *:data-[state=open]:bg-amber-600
                                            *:data-[state=open]:text-light
                                        '
                                    >
                                        {
                                            effects.map(effect =>
                                                <ContextMenu.RadioItem
                                                    key={effect}
                                                    className={clsx('px-3 py-1.5', { 'bg-amber-600 text-light': value.effect === effect })}
                                                    value={effect}
                                                >
                                                    {
                                                        capitalize(
                                                            effect.split('-').join(' ')
                                                        )
                                                    }
                                                </ContextMenu.RadioItem>
                                            )
                                        }
                                    </ContextMenu.RadioGroup>
                                </ContextMenu.SubContent>
                            </ContextMenu.Portal>
                        </ContextMenu.Sub>
                        <ContextMenu.Separator className='bg-neutral-200 py-[.5px] my-1' />
                        <ContextMenu.Item className='px-3 py-1.5' onSelect={() => onDuplicate(value)}>
                            Duplicate
                        </ContextMenu.Item>
                    </ContextMenu.Content>
                </ContextMenu.Portal>
            </ContextMenu.Root>
            <EditDescription
                open={dialog}
                onOpenChange={setDialog}
                onSave={(alt: string) => setImageAlt({ ...image, alt: alternative(alt) })}
            />
        </div>
    )
}

type GroupEvent = { x: number, y: number, dx: number, dy: number, subject: { x: number, y: number } }

const Group = ({ onEffect, container, onDragStart, onDrag, onDragEnd, x0, y0, x1, y1 }: {
    container: React.RefObject<HTMLElement | null>,
    onEffect: (effect: string) => void,
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    onDragStart: (e: GroupEvent) => void,
    onDrag: (e: GroupEvent) => void,
    onDragEnd: (e: GroupEvent) => void
}) => {
    const ref = useRef<HTMLDivElement>(null)

    const [effect, setEffect] = useState('')

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
        <ContextMenu.Root>
            <ContextMenu.Trigger>
                <div
                    ref={ref}
                    className='absolute top-0 left-0 outline-1 outline-blue-500 z-20'
                    style={{
                        transform: `translate(${x0}px, ${y0}px)`,
                        width: (x1 - x0) + 'px',
                        height: (y1 - y0) + 'px'
                    }}
                />
            </ContextMenu.Trigger>
            <ContextMenu.Portal>
                <ContextMenu.Content
                    className='
                        flex
                        flex-col
                        gap-y-0.5
                        z-50
                        p-1
                        bg-light 
                        dark:bg-dark
                        rounded-sm
                        font-sans 
                        text-sm 
                        font-semibold
                        ring-1
                        ring-neutral-200
                        *:capitalize
                        *:rounded-sm
                        *:size-full
                        *:select-none
                        *:outline-transparent
                        *:data-highlighted:bg-amber-600
                        *:data-highlighted:text-light
                        *:data-[state=open]:bg-amber-600
                        *:data-[state=open]:text-light
                        *:transition-colors
                        min-w-35
                    '
                    onContextMenu={e => e.stopPropagation()}
                >
                    <ContextMenu.Sub>
                        <ContextMenu.SubTrigger className='flex justify-between items-center px-3 py-1.5'>
                            <span>Effects</span>
                            <span>
                                <ChevronRightIcon />
                            </span>
                        </ContextMenu.SubTrigger>
                        <ContextMenu.Portal>
                            <ContextMenu.SubContent
                                onContextMenu={e => e.stopPropagation()}
                                alignOffset={-4}
                                sideOffset={5}
                                asChild
                            >
                                <ContextMenu.RadioGroup
                                    value={effect}
                                    onValueChange={effect => {
                                        setEffect(effect)
                                        onEffect(effect)
                                    }}
                                    className='
                                        flex
                                        flex-col
                                        gap-y-0.5
                                        z-50
                                        p-1
                                        bg-light 
                                        dark:bg-dark
                                        rounded-sm
                                        font-sans 
                                        text-sm 
                                        font-semibold
                                        ring-1
                                        ring-neutral-200
                                        *:rounded-sm
                                        *:size-full
                                        *:select-none
                                        *:outline-transparent
                                        *:transition-colors
                                        *:data-highlighted:bg-amber-600
                                        *:data-highlighted:text-light
                                        *:data-[state=open]:bg-amber-600
                                        *:data-[state=open]:text-light
                                    '
                                >
                                    {
                                        effects.map(value =>
                                            <ContextMenu.RadioItem
                                                key={value}
                                                className={clsx('px-3 py-1.5', { 'bg-amber-600 text-light': effect === value })}
                                                value={value}
                                            >
                                                {
                                                    capitalize(
                                                        value.split('-').join(' ')
                                                    )
                                                }
                                            </ContextMenu.RadioItem>
                                        )
                                    }
                                </ContextMenu.RadioGroup>
                            </ContextMenu.SubContent>
                        </ContextMenu.Portal>
                    </ContextMenu.Sub>
                </ContextMenu.Content>
            </ContextMenu.Portal>
        </ContextMenu.Root>
    )
}

const itemsToGroup = (ox: number, oy: number, items: Box[]) =>
    items.reduce((acc, curr) => ({
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

const Editor = ({
    asset,
    setAsset,
    layout,
    setLayout,
}: {
    asset: Asset,
    setAsset: (fn: (asset: Asset) => Asset) => void,
    layout: Layout,
    setLayout: (fn: (layout: Layout) => Layout) => void
}) => {
    const rootRef = useRef<HTMLElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const contextRef = useRef<CanvasRenderingContext2D>(null)
    const [actives, setActives] = useState<string[]>([])
    const [interactive, setInteractive] = useState(true)
    const [[pw, ph], setParentSize] = useState([0, 0])
    const [z, setZ] = useState(0)

    const dpr = (window?.devicePixelRatio ?? 1)

    const cssSize = { width: Math.round(pw) + 'px', height: Math.round(ph) + 'px' }

    const attSize = { width: Math.round(pw * dpr), height: Math.round(ph * dpr) }

    const resetCanvas = () => {
        const canvas = canvasRef.current!
        const context = contextRef.current!
        const dpr = (window?.devicePixelRatio ?? 1)

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

        context.setLineDash([2, 2])
        context.strokeStyle = blue

        context.beginPath()
        context.rect(ox - 1, oy - 1, container.width + 2, container.height + 2)
        context.clip()

        lines.forEach(([[sx, sy], [ex, ey]]) => {
            const crisp = eq(sx, ex) ? offsetX : offsetY
            const start: [number, number] = crisp([sx + ox, sy + oy])
            const end: [number, number] = crisp([ex + ox, ey + oy])
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

        lines.forEach(([[sx, sy], [ex, ey]]) => {
            const crisp = eq(sx, ex) ? offsetX : offsetY
            const start: [number, number] = crisp([sx + ox, sy + oy])
            const end: [number, number] = crisp([ex + ox, ey + oy])
            path.moveTo(...start)
            path.lineTo(...end)
        })

        resetCanvas()

        context.save()

        context.strokeStyle = orange

        context.beginPath()
        context.rect(ox - 1, oy - 1, container.width + 2, container.height + 2)
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
            setParentSize([width, height])
        })

        const onDelete = (e: { key: string }) => {
            if(e.key === 'Delete') {
                const [actives] = splitChildrenAsBoxes(container)
                const ids = actives.map(v => v.id)

                if(actives.length > 0) {
                    setInteractive(true)
                    setLayout((layout: Layout) => {
                        const items = layout.items.filter(v =>
                            !ids.includes(v.id)
                        )
                        const height = getItemsHeight(items)
                        return { ...layout, items, height }
                    })
                    setActives([])
                    clearCanvas()
                }
            }
        }

        contextRef.current = context
        resizer.observe(root)
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
                    const childrens = [...container.children]
                    const actives = childrens.reduce<string[]>((acc, curr) => {
                        const rect = curr.getBoundingClientRect()
                        const element = curr as HTMLElement
                        const intersected = isBoxesIntersect(
                            { x, y, w, h },
                            {
                                x: rect.x - c.x,
                                y: rect.y - c.y,
                                w: rect.width,
                                h: rect.height
                            }
                        )
                        if(intersected) {
                            return acc.concat([element.dataset.id as string])
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
            rootSelection.on('.drag', null)
        }
    }, [])

    const applyChange = curry((index: number, item: Item) =>
        setLayout((layout: Layout) => {
            const items = layout.items.with(index, item)
            const height = getItemsHeight(items)
            return { ...layout, height, items }
        })
    )

    const bringToFront = curry((index: number, item: Item) =>
        setLayout((layout: Layout) => {
            const max = Math.max(
                ...layout.items.map(v => v.z)
            )
            const items = layout.items.with(index, { ...item, z: max + 1 })
            return { ...layout, items }
        })
    )

    const sendToBack = curry((index: number, item: Item) =>
        setLayout((layout: Layout) => {
            const items = layout.items.with(index, { ...item, z: 0 })
            return { ...layout, items }
        })
    )

    const drawActiveLines = (item: Item) => {
        const cx = item.x + half(item.w)
        const cy = item.y + half(item.h)

        drawBlueLines([
            [[0, cy], [item.x, cy]],
            [[cx, 0], [cx, item.y]]
        ])
    }

    const onContextMenu = curry((index: number, item: Item) => {
        setInteractive(true)
        setActives([item.id])

        drawActiveLines(item)
    })

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

        const [actives, inactives] = splitChildrenAsBoxes(container)

        const group = itemsToGroup(0, 0, actives)

        const constrain = { x: 0, y: 0, w: c.width, h: Infinity }

        const initial = {
            x: group.x0,
            y: group.y0,
            w: group.x1 - group.x0,
            h: group.y1 - group.y0
        }

        const moved = applyBoxConstrain(constrain, {
            ...initial,
            x: initial.x + e.dx,
            y: initial.y + e.dy
        })

        const canvas = { ...constrain, h: c.height }

        const [ox, oy] = snap(5, moved, [canvas, ...inactives])

        const result = applyBoxConstrain(constrain, {
            ...moved,
            x: moved.x + ox,
            y: moved.y + oy
        })

        const dx = result.x - initial.x
        const dy = result.y - initial.y

        setLayout((layout: Layout) => {
            const items = actives.reduce(
                (a, b) => {
                    const item = layout.items[b.i]
                    return a.with(b.i, {
                        ...item,
                        x: item.x + dx,
                        y: item.y + dy
                    })
                },
                layout.items
            )
            const height = getItemsHeight(items)
            return { ...layout, items, height }
        })

        const lines = snapLines(result, [canvas, ...inactives])

        if(lines.length > 0) {
            drawOrangeLines(lines)
        } else {
            clearCanvas()
        }
    }
    const onGroupDragEnd = (e: { x: number, y: number, subject: { x: number, y: number } }) => {
        const dx = e.x - e.subject.x
        const dy = e.y - e.subject.y

        if(dx || dy) {
            clearCanvas()
        } else {
            const container = containerRef.current!
            const c = container.getBoundingClientRect()
            const items = [...container.children]
            const index = items.findIndex(v => {
                const r = v.getBoundingClientRect()
                return isInsideBox(
                    {
                        x: r.x - c.x,
                        y: r.y - c.y,
                        w: r.width,
                        h: r.height
                    },
                    e.x,
                    e.y
                )
            })

            setInteractive(true)

            if(index < 0) {
                setActives([])
            } else {
                const el = items[index]
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

                setActives([element.dataset.id as string])
                drawBlueLines([
                    [[0, cy], [item.x, cy]],
                    [[cx, 0], [cx, item.y]]
                ])
            }
        }
    }

    const onGroupEffect = curry((group: Items, effect: string) =>
        setLayout((layout: Layout) => {
            const table: Record<string, number> = layout.items.reduce((a, b, i) => ({ ...a, [b.id]: i }), {})
            const indexes = group.map(v => table[v.id])
            const items = indexes.reduce((a, b) => a.with(b, { ...a[b], effect }), layout.items)
            return { ...layout, items }
        })
    )

    const sizeExtent: Extent = [
        [15, layout.width],
        [15, Infinity]
    ]

    const translateExtent: Extent = [
        [0, layout.width],
        [0, Infinity]
    ]

    const onMoveStart = curry((index: number, item: Item) => {
        setInteractive(true)
        setActives([item.id])
        drawActiveLines(item)
    })

    const onMove = curry((index: number, item: Item) => {
        const c = containerRef.current!.getBoundingClientRect()
        const container = { x: 0, y: 0, w: c.width, h: c.height }
        const constrain = { ...container, h: Infinity }

        const [_, others] = splitChildrenAsBoxes(containerRef.current!)

        const [ox, oy] = snap(5, item, [constrain, ...others])

        const result = applyBoxConstrain(constrain, {
            ...item,
            x: item.x + ox,
            y: item.y + oy
        })

        const lines = snapLines(result, [container, ...others])

        setInteractive(false)
        applyChange(index, result)

        if(lines.length > 0) {
            drawOrangeLines(lines)
        } else {
            clearCanvas()
        }
    })

    const onMoveEnd = curry((_index: number, item: Item) => {
        setInteractive(true)
        drawActiveLines(item)
    })

    const onResizeStart = curry((_index: number, item: Item) => {
        setInteractive(true)
        drawActiveLines(item)
    })

    const onResize = curry((index: number, item: Item) => {
        const [[wMin, wMax], [hMin, hMax]] = sizeExtent
        const c = containerRef.current!.getBoundingClientRect()
        const container = { x: 0, y: 0, w: c.width, h: c.height }

        const constrain = { ...container, h: Infinity }

        const [[prev], others] = splitChildrenAsBoxes(containerRef.current!)

        const [dx, dy] = snap(5, item, [constrain, ...others])

        const xs = centers(prev)
        const ys = centers(item)

        const [[i]] = ys.map(([a, b], i) => {
            const [c, d] = xs[i]
            return [i, Math.hypot(a - c, b - d)]
        }, []).toSorted(([, b], [, d]) => b - d)

        const [ox, oy] = ys[i]

        const sign = Math.sign(
            (item.w * item.h) - (prev.w * prev.h)
        )
        const m = Math.max(dx, dy)
        const s = 1 + Math.abs(m) * sign * (m === dx ? 1 / item.w : 1 / item.h)

        const d = clamp(
            Math.max(wMin / item.w, hMin / item.h),
            Math.min(wMax / item.w, hMax / item.h),
            s
        )
        const result = applyBoxConstrain(
            constrain,
            {
                ...item,
                x: ox - (ox - item.x) * d,
                y: oy - (oy - item.y) * d,
                w: item.w * d,
                h: item.h * d
            }
        )

        const lines = snapLines(result, [container, ...others])

        setInteractive(false)
        applyChange(index, item)

        if(lines.length > 0) {
            drawOrangeLines(lines)
        } else {
            clearCanvas()
        }
    })

    const onResizeEnd = curry((_index: number, item: Item) => {
        drawActiveLines(item)
        setInteractive(true)
    })

    const onCropStart = curry((_index: number, _item: Item) => {
        clearCanvas()
        setInteractive(false)
    })

    const onCrop = curry((index: number, item: Item) => {
        applyChange(index, item)
    })

    const onCropEnd = curry((_index: number, _item: Item) => {
        setInteractive(true)
    })

    const onDuplicate = curry((_index: number, item: Item) => {
        const id = UUIDv7()

        setActives([id])
        setLayout((layout: Layout) => {
            const c = containerRef.current!.getBoundingClientRect()
            const items = layout.items.concat([
                applyBoxConstrain(
                    { x: 0, y: 0, w: c.width, h: Infinity },
                    {
                        ...item,
                        id: id,
                        x: item.x + .05 * item.w,
                        y: item.y + .05 * item.h
                    }
                )
            ])
            const height = getItemsHeight(items)
            return { ...layout, items, height }
        })
    })

    const onEffect = applyChange

    const setAsThumbnail = (image: Photo) => setAsset(asset =>
        Object.entries(asset).reduce((a, [k, v]) => ({
            ...a,
            [k]: { ...v, thumbnail: image.id === k }
        }), {})
    )

    const setImageAlt = (image: Photo) =>
        setAsset((asset: Asset) => {
            return { ...asset, [image.id]: image }
        })

    const group = actives.length > 1
        ? layout.items.filter(v =>
            actives.includes(v.id)
        )
        : ([])

    return ( // add sticky effect
        <section
            ref={rootRef}
            className='relative size-full flex flex-col items-center'
        >
            <div
                ref={containerRef}
                className='relative outline-1 outline-neutral-200'
                data-testid='container'
                style={{
                    width: layout.width + 'px',
                    height: layout.height + 'px'
                }}
            >
                {
                    layout.items.map((item, i) =>
                        <Editable
                            key={item.id + i}
                            container={containerRef}
                            active={actives.includes(item.id)}
                            interactive={interactive}
                            image={asset[item.src]}
                            value={item}
                            sizeExtent={sizeExtent}
                            translateExtent={translateExtent}
                            onContextMenu={onContextMenu(i)}
                            bringToFront={bringToFront(i)}
                            sendToBack={sendToBack(i)}
                            setAsThumbnail={setAsThumbnail}
                            setImageAlt={setImageAlt}
                            onMoveStart={onMoveStart(i)}
                            onMove={onMove(i)}
                            onMoveEnd={onMoveEnd(i)}
                            onCropStart={onCropStart(i)}
                            onCrop={onCrop(i)}
                            onCropEnd={onCropEnd(i)}
                            onResizeStart={onResizeStart(i)}
                            onResize={onResize(i)}
                            onResizeEnd={onResizeEnd(i)}
                            onDuplicate={onDuplicate(i)}
                            onEffect={onEffect(i)}
                        />
                    )
                }
            </div>
            <canvas
                ref={canvasRef}
                className='pointer-events-none absolute bg-transparent'
                style={{ ...cssSize, zIndex: z || 'auto' }}
                {...attSize}
            />
            {
                group.length > 1
                    ? <Group
                        container={containerRef}
                        onDragStart={onGroupDragStart}
                        onDrag={onGroupDrag}
                        onDragEnd={onGroupDragEnd}
                        onEffect={onGroupEffect(group)}
                        {...calculateGroup(group)}
                    />
                    : null
            }
        </section>
    )
}

export default Editor