import { ComponentProps } from 'react'
import { describe, expect, test, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { Locator, page } from 'vitest/browser'
import { Asset, Box, Extent, Item, Layout } from '@/type/editor'
import { v7 as UUIDv7 } from 'uuid'
import { counts, half, resize, sequences, crop, center, clamp, defaultThumbnail } from '@/utility/fn'
import Editor from '@/components/Editor'

const width = 1280
const size = width / 3
const height = width
const edited = false
const defaultImage = defaultThumbnail()

const scaled = Math.min(defaultImage.width / size, defaultImage.height / size) * size

const defaultItem = {
    id: UUIDv7(),
    src: defaultImage.id,
    z: 1,
    x: half(width) - half(size),
    y: half(height) - half(size),
    w: size,
    h: size,
    sx: ((defaultImage.width - scaled) * .5) / defaultImage.width,
    sy: ((defaultImage.height - scaled) * .5) / defaultImage.height,
    sw: scaled / defaultImage.width,
    sh: scaled / defaultImage.height,
    effect: ''
}

const asset = { [defaultImage.id]: defaultImage }

const items = [defaultItem]

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

const moves = [[0, 0], ...points(.25 * size)]

const scaleUps = counts(i => 1 + i * (1 / 5), 6, [])
const scaleDowns = counts(i => i * (1 / 5), 6, [])

const scales = [...scaleUps, ...scaleDowns]

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

    expect(Math.trunc(a.x - b.x)).lessThan(1)
    expect(Math.trunc(a.y - b.y)).lessThan(1)
    expect(Math.trunc(a.w - b.w)).lessThan(1)
    expect(Math.trunc(a.h - b.h)).lessThan(1)
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

    expect(Math.trunc(a.sx - b.sx)).lessThan(1)
    expect(Math.trunc(a.sy - b.sy)).lessThan(1)
    expect(Math.trunc(a.sw - b.sw)).lessThan(1)
    expect(Math.trunc(a.sh - b.sh)).lessThan(1)
}

const translateBox = <T extends Box>(x: number, y: number, box: T) => ({
    ...box,
    x: Math.max(box.x + x, 0),
    y: Math.max(box.y + y, 0)
})

const init = async (props?: Partial<ComponentProps<typeof Editor>>) => {
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

    const editor = await render(
        <Editor {...initialProps} />
    )

    const rerender = (props?: Partial<ComponentProps<typeof Editor>>) => {
        setLayout.mockReset()
        setLayout.mockImplementationOnce(
            (fn: (layout: Layout) => Layout) => fn(props?.layout ?? layout)
        )
        return editor.rerender(
            <Editor {...{ ...initialProps, ...props }} />
        )
    }

    const reset = async () => {
        setLayout.mockReset()
        return editor.rerender(
            <Editor {...initialProps} />
        )
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
        const { layout, editor } = await init()

        const container = editor.getByTestId('container')
        const item = editor.getByTestId('item')

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
        const { editor, setLayout, rerender, reset } = await init()

        const container = editor.getByTestId('container')
        const item = editor.getByTestId('item')

        const iBox = toBox(item)

        const [ex, ey] = center(iBox)

        await sequences(
            async ([mx, my]) =>
                item.dropTo(container, {
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
                    const a = toBox(item)
                    const b = translateBox(mx, my, iBox)

                    boxTests(sizeExtent, translateExtent, a, b)

                    return reset()
                })
            ,
            moves
        )
    })

    test('resize should change the size and/or position of an item', async () => {
        const { editor, setLayout, rerender, reset } = await init()

        const container = editor.getByTestId('container')
        const item = editor.getByTestId('item')
        const handles = editor.getByTestId('handle').all()

        const iBox = toBox(item)
        const [ex, ey] = center(iBox)

        await item.click({
            position: { x: half(iBox.w), y: half(iBox.h) }
        })

        await sequences(
            s => sequences(
                h => {
                    const hBox = toBox(h)
                    const [hx, hy] = center(hBox)

                    const ax = Math.sign(
                        Math.trunc(hx) - Math.trunc(ex)
                    )
                    const ay = Math.sign(
                        Math.trunc(hy) - Math.trunc(ey)
                    )
                    const dx = ((s * iBox.w) - iBox.w) * ax
                    const dy = ((s * iBox.h) - iBox.h) * ay

                    return h.dropTo(container, {
                        sourcePosition: {
                            x: half(hBox.w),
                            y: half(hBox.h)
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
                    }).then(async () => {
                        const a = toBox(item)

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
        const { editor, reset, setLayout, rerender } = await init({
            layout: {
                ...layout,
                items: items.map(v => {
                    return {
                        ...v,
                        sx: v.sx + .1,
                        sy: v.sy + .1,
                        sw: v.sw * .8,
                        sh: v.sh * .8,
                    }
                })
            }
        })

        const container = editor.getByTestId('container')
        const item = editor.getByTestId('item')
        const image = editor.getByTestId('image')
        const handles = editor.getByTestId('handle').all()

        const iBox = toItem(image, item)
        const [ex, ey] = center(iBox)

        const mBox = toBox(image)

        const [imx, imy] = center(mBox)

        const ref = iBox

        await item.click({
            button: 'right',
            position: { x: half(iBox.w), y: half(iBox.h) }
        }).then(() =>
            page.getByTestId('crop').click()
        )

        await sequences(
            s => sequences(
                async h => {
                    const hBox = toBox(h)
                    const [hx, hy] = center(hBox)

                    const ax = Math.sign(
                        Math.trunc(hx) - Math.trunc(ex)
                    )
                    const ay = Math.sign(
                        Math.trunc(hy) - Math.trunc(ey)
                    )

                    const dx = ((s * iBox.w) - iBox.w) * ax
                    const dy = ((s * iBox.h) - iBox.h) * ay

                    return h.dropTo(container, {
                        sourcePosition: {
                            x: half(hBox.w),
                            y: half(hBox.h)
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
                    }).then(async () => {
                        const a = toItem(image, item)

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
                image.dropTo(container, {
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
                    const a = toItem(image, item)
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
    })
})