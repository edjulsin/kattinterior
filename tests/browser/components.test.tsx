import { describe, expect, test, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { Locator, page } from 'vitest/browser'
import { Asset, Box, Extent, Item, Layout } from '@/type/editor'
import { v7 as UUIDv7 } from 'uuid'
import { counts, defaultThumbnail, half, resize, sequences, crop, center, clamp } from '@/utility/fn'
import Editor from '@/components/Editor'
import React, { ComponentProps } from 'react'

const width = 1280
const size = width / 3
const height = size
const edited = false

const image = defaultThumbnail()

const scaled = Math.min(image.width / size, image.height / size) * size

const item = {
    id: UUIDv7(),
    src: image.id,
    z: 1,
    x: half(width) - half(size),
    y: 0,
    w: size,
    h: size,
    sx: ((image.width - scaled) * .5) / image.width,
    sy: ((image.height - scaled) * .5) / image.height,
    sw: scaled / image.width,
    sh: scaled / image.height,
    effect: ''
}

const asset = { [image.id]: image }

const items = [item]

const layout = { edited, width, height, items }

const sizeExtent: Extent = [
    [15, width],
    [15, Infinity]
]

const translateExtent: Extent = [
    [0, width],
    [0, Infinity]
]

const points = (offset: number) => ([
    [offset, offset],
    [offset, 0],
    [0, offset],
    [-offset, -offset],
    [-offset, 0],
    [0, -offset]
])

const moves = [ // must be greater than 5 because of snap
    [0, 0],
    ...points(.1 * size),
    ...points(.25 * size),
    ...points(.5 * size),
    ...points(size)
]

const scales = [
    ...counts(i => 1 + i * (1 / 5), 6, []),
    ...counts(i => i * (1 / 5), 6, [])
]

const toBox = (item: Locator) => {
    const box = item.element().getBoundingClientRect()
    return {
        x: box.x,
        y: box.y,
        w: box.width,
        h: box.height
    }
}

const toItem = (image: Locator, item: Locator) => {
    const im = image.element()
    const it = item.element()
    const mBox = im.getBoundingClientRect()
    const iBox = it.getBoundingClientRect()
    return {
        id: it.dataset.id!,
        src: it.dataset.src!,
        z: Number(it.dataset.z),
        x: iBox.x,
        y: iBox.y,
        w: iBox.width,
        h: iBox.height,
        sx: (iBox.x - mBox.x) / mBox.width,
        sy: (iBox.y - mBox.y) / mBox.height,
        sw: iBox.width / mBox.width,
        sh: iBox.height / mBox.height,
        effect: it.dataset.effect as string
    }
}

const boxTests = ([[wMin, wMax], [hMin, hMax]]: Extent, [[xMin, xMax], [yMin, yMax]]: Extent, a: Box, b: Box) => {
    const boxes = [a, b]

    boxes.forEach(box => {
        expect(box.w).greaterThanOrEqual(wMin)
        expect(box.w).lessThanOrEqual(wMax)
        expect(box.h).greaterThanOrEqual(hMin)
        expect(box.h).lessThanOrEqual(hMax)
    })

    boxes.forEach(box => {
        expect(box.x).greaterThanOrEqual(xMin)
        expect(box.x + box.w).lessThanOrEqual(xMax)
        expect(box.y).greaterThanOrEqual(yMin)
        expect(box.y + box.h).lessThanOrEqual(yMax)
    })

    expect(Math.abs(a.x - b.x)).lessThan(1)
    expect(Math.abs(a.y - b.y)).lessThan(1)
    expect(Math.abs(a.w - b.w)).lessThan(1)
    expect(Math.abs(a.h - b.h)).lessThan(1)
}

const itemTests = (sizeExtent: Extent, translateExtent: Extent, a: Item, b: Item) => {
    const items = [a, b]

    boxTests(sizeExtent, translateExtent, a, b)

    items.forEach(item => {
        expect(item.sx).greaterThanOrEqual(0)
        expect(item.sy).greaterThanOrEqual(0)
        expect(item.sw).lessThanOrEqual(1)
        expect(item.sh).lessThanOrEqual(1)
    })

    expect(a.sx - b.sx).toBeCloseTo(0)
    expect(a.sy - b.sy).toBeCloseTo(0)
    expect(a.sw - b.sw).toBeCloseTo(0)
    expect(a.sh - b.sh).toBeCloseTo(0)
}

const translateBox = <T extends Box>(x: number, y: number, box: T) => ({
    ...box,
    x: Math.max(box.x + x, 0),
    y: Math.max(box.y + y, 0)
})

const init = async (width: number, height: number, props?: Partial<ComponentProps<typeof Editor>>) => {
    const setLayout = vi.fn(
        (fn: (layout: Layout) => Layout) => fn(props?.layout ?? layout)
    )
    const setAsset = vi.fn(
        (fn: (layout: Asset) => Asset) => fn(asset)
    )

    const initialProps = {
        setLayout,
        setAsset,
        asset,
        layout,
        ...(props ?? ({}))
    }

    const padding = 200

    await page.viewport(width, height + padding)

    const editor = await render(
        <Editor {...initialProps} />,
        {
            wrapper: ({ children }: { children: React.ReactNode }) =>
                <div data-testid='wrapper' className='size-full py-25 flex flex-col justify-center'>
                    {children}
                </div>
        }
    )

    const rerender = (props?: Partial<ComponentProps<typeof Editor>>) =>
        editor.rerender(
            <Editor {...{ ...initialProps, ...props }} />
        ).then(() =>
            page.viewport(
                Math.max(props?.layout?.width ?? initialProps.layout.width, width),
                Math.max(props?.layout?.height ?? initialProps.layout.height, height) + padding
            )
        )

    const reset = async () => {
        setLayout.mockReset()
        return editor.rerender(
            <Editor {...initialProps} />
        ).then(() => {
            return page.viewport(width, height + padding)
        })
    }

    return {
        setLayout,
        setAsset,
        asset,
        layout,
        editor,
        rerender,
        reset
    }
}

describe('Editor', () => {
    test('container & items should have correct positions and sizes', async () => {
        const { layout, editor } = await init(width, height)
        const container = editor.getByTestId('container')
        const item = editor.getByTestId('editable')

        const cBox = toBox(container)
        const iBox = toBox(item)
        const [ref] = layout.items

        await Promise.all([
            expect.element(container).toBeInTheDocument(),
            expect.element(container).toBeInViewport({ ratio: .99 })
        ])

        expect(cBox.w - width).toBeCloseTo(0, 1)
        expect(cBox.h - height).toBeCloseTo(0, 1)

        await Promise.all([
            expect.element(item).toBeInTheDocument(),
            expect.element(item).toBeInViewport({ ratio: .99 })
        ])

        boxTests(
            sizeExtent,
            translateExtent,
            ref,
            translateBox(-cBox.x, -cBox.y, iBox)
        )
    })

    test('items should moved to correct position when dragged', async () => {
        const { layout, editor, setLayout, rerender, reset } = await init(width, height)

        const wrapper = editor.getByTestId('wrapper')
        const container = editor.getByTestId('container')
        const item = editor.getByTestId('editable')

        const wBox = toBox(wrapper)
        const cBox = toBox(container)
        const iBox = translateBox(
            -wBox.x,
            -wBox.y,
            toBox(item)
        )

        const [ex, ey] = center(iBox)

        const [ref] = layout.items

        await sequences(
            async ([mx, my]) =>
                item.dropTo(wrapper, {
                    sourcePosition: { x: half(iBox.w), y: half(iBox.h) },
                    targetPosition: {
                        x: ex + mx,
                        y: ey + my
                    }
                }).then(async () => {
                    const [result] = setLayout.mock.results
                        .filter(v => v.type === 'return')
                        .map(v => v.value)

                    return rerender({ layout: result })
                }).then(async () => {
                    const a = translateBox(
                        -cBox.x,
                        -cBox.y,
                        toBox(item)
                    )
                    const b = translateBox(mx, my, ref)

                    boxTests(sizeExtent, translateExtent, a, b)

                    return reset()
                })
            ,
            moves
        )
    })

    test('resize should change the size and/or position of an item', async () => {
        const { editor, setLayout, rerender, reset } = await init(width, height)

        const wrapper = editor.getByTestId('wrapper')
        const container = editor.getByTestId('container')
        const item = editor.getByTestId('editable')
        const handles = editor.getByTestId('handle').all()

        const wBox = toBox(wrapper)
        const cBox = toBox(container)
        const iBox = translateBox(
            -cBox.x,
            -cBox.y,
            toBox(item)
        )

        const [ex, ey] = center(iBox)

        await item.click({
            position: { x: half(iBox.w), y: half(iBox.h) }
        })

        await sequences(
            s => sequences(
                h => {
                    const hBox = toBox(h)
                    const handle = translateBox(-cBox.x, -cBox.y, hBox)
                    const [hx, hy] = center(handle)
                    const ax = Math.sign(hx - ex)
                    const ay = Math.sign(hy - ey)
                    const dx = ((s * iBox.w) - iBox.w) * ax
                    const dy = ((s * iBox.h) - iBox.h) * ay

                    const target = translateBox(-wBox.x, -wBox.y, hBox)

                    const [tx, ty] = center(target)

                    return h.dropTo(wrapper, {
                        sourcePosition: {
                            x: half(handle.w),
                            y: half(handle.h)
                        },
                        targetPosition: {
                            x: tx + dx,
                            y: ty + dy
                        }
                    }).then(() => {
                        const [result] = setLayout.mock.results
                            .filter(v => v.type === 'return')
                            .map(v => v.value)

                        return rerender({ layout: result })
                    }).then(() => {
                        const a = translateBox(
                            -cBox.x,
                            -cBox.y,
                            toBox(item)
                        )

                        const b = resize(
                            [[15, width], [15, Infinity]],
                            [[0, width], [0, Infinity]],
                            [ex + -ax * half(iBox.w), ey + -ay * half(iBox.h)],
                            s,
                            iBox
                        )

                        boxTests(sizeExtent, translateExtent, a, b)

                        return reset()
                    })
                },
                handles
            ),
            scales
        )
    })

    test('crop should change the size and/or position of an item and change image crop region', async () => {
        const { editor, reset, setLayout, rerender } = await init(width, height)

        const container = editor.getByTestId('container')
        const wrapper = editor.getByTestId('wrapper')
        const item = editor.getByTestId('editable')
        const image = editor.getByRole('img')
        const handles = editor.getByTestId('handle').all()

        const cBox = toBox(container)
        const wBox = toBox(wrapper)
        const ref = translateBox(
            -cBox.x,
            -cBox.y,
            toItem(image, item)
        )
        const iBox = translateBox(-cBox.x, -cBox.y, ref)
        const mBox = translateBox(
            -cBox.x,
            -cBox.y,
            toBox(image)
        )

        const [ex, ey] = center(iBox)

        const [imx, imy] = center(
            translateBox(
                -wBox.x,
                -wBox.y,
                toBox(image)
            )
        )

        await item.click({
            button: 'right',
            position: { x: half(iBox.w), y: half(iBox.h) }
        }).then(() =>
            page.getByTestId('crop').click()
        )

        await sequences(
            s => sequences(
                h => {
                    const hBox = toBox(h)
                    const handle = translateBox(-wBox.x, -wBox.y, hBox)
                    const [hx, hy] = center(handle)

                    const [chx, chy] = center(
                        translateBox(-cBox.x, -cBox.y, hBox)
                    )

                    const ax = Math.sign(chx - ex)
                    const ay = Math.sign(chy - ey)

                    const dx = ((s * iBox.w) - iBox.w) * ax
                    const dy = ((s * iBox.h) - iBox.h) * ay

                    return h.dropTo(wrapper, {
                        sourcePosition: {
                            x: half(handle.w),
                            y: half(handle.h)
                        },
                        targetPosition: {
                            x: hx + dx,
                            y: hy + dy
                        }
                    }).then(() => {
                        const [result] = setLayout.mock.results
                            .filter(v => v.type === 'return')
                            .map(v => v.value)

                        return rerender({ layout: result })
                    }).then(() => {
                        const a = translateBox(
                            -cBox.x,
                            -cBox.y,
                            toItem(image, item)
                        )

                        const sx = ax === 0 ? 1 : s
                        const sy = ay === 0 ? 1 : s

                        const b = crop(
                            [[15, width], [15, Infinity]],
                            [[0, width], [0, Infinity]],
                            [ex + -ax * half(iBox.w), ey + -ay * half(iBox.h)],
                            sx,
                            sy,
                            mBox,
                            iBox
                        )

                        itemTests(sizeExtent, translateExtent, a, b)

                        return reset()
                    })
                },
                handles
            ),
            scales
        )

        await sequences(
            async ([mx, my]) =>
                image.dropTo(wrapper, {
                    sourcePosition: { x: half(mBox.w), y: half(mBox.h) },
                    targetPosition: {
                        x: imx + mx,
                        y: imy + my
                    }
                }).then(async () => {
                    const [result] = setLayout.mock.results
                        .filter(v => v.type === 'return')
                        .map(v => v.value)

                    return rerender({ layout: result })
                }).then(async () => {
                    const a = translateBox(
                        -cBox.x,
                        -cBox.y,
                        toItem(image, item)
                    )
                    const b = {
                        ...ref,
                        sx: clamp(
                            0,
                            1 - (ref.w / mBox.w),
                            (ref.x - (mBox.x + mx) / mBox.w)
                        ),
                        sy: clamp(
                            0,
                            1 - (ref.h / mBox.h),
                            (ref.y - (mBox.y + my) / mBox.h)
                        )
                    }

                    itemTests(sizeExtent, translateExtent, a, b)

                    return reset()
                })
            ,
            moves
        )

        await wrapper.click({
            position: { x: 0, y: 0 }
        })
    })
})