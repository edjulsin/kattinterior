import { describe, expect, test } from 'vitest'
import { Box, Extent, Item, Items, Point, Points } from '@/type/editor'
import { center, centers, corners, counts, crop, getLayout, groupByRow, half, origins, resize, snapLines, trunc } from '@/utility/fn'
import { v7 as UUIDv7 } from 'uuid'

const canvas = {
    x: 0,
    y: 0,
    w: 1000,
    h: 2000
}

const col = 3
const size = canvas.w / col

const generateRandomItem = (x: number, y: number, size: number) => {
    return {
        id: UUIDv7(),
        src: '',
        z: 0,
        x: x,
        y: y,
        w: size,
        h: size,
        sx: 0,
        sy: 0,
        sw: 1,
        sh: 1,
        effect: ''
    }
}

const image = {
    x: canvas.x + half(canvas.w) - half(size * 2),
    y: canvas.y + half(canvas.h) - half(size * 2),
    w: size * 2,
    h: size * 2
}

const item = {
    id: UUIDv7(),
    z: 0,
    src: '',
    x: canvas.x + half(canvas.w) - half(size),
    y: canvas.y + half(canvas.h) - half(size),
    w: size,
    h: size,
    sx: half(image.w - size) / image.w,
    sy: half(image.h - size) / image.h,
    sw: size / image.w,
    sh: size / image.h,
    effect: ''
}

const minWidth = 15
const minHeight = 15
const maxWidth = canvas.w
const maxHeight = canvas.h
const translateExtent: Extent = [
    [canvas.x, canvas.x + canvas.w],
    [canvas.y, canvas.y + canvas.h]
]
const sizeExtent: Extent = [
    [minWidth, maxWidth],
    [minHeight, maxHeight]
]

const origin = center(item)
const points = origins(item).map(v =>
    v.map(trunc) as Point
)

const ups = counts((i: number) => 1 + (i + 1) / 10, 30, [])
const downs = counts((i: number) => 1 - (i + 1) / 10, 30, [])

const templateToItems = (size: number, template: Points[]) =>
    template.flatMap(v =>
        v.map(([x, y]) =>
            generateRandomItem(
                x * size + Math.sign(x) * x,
                y * size + Math.sign(y) * y,
                size
            )
        )
    ).toSorted((a, b) =>
        Math.sign(a.x - b.x) + Math.sign(a.y - b.y)
    )


const strictRowTest = (count: number, layout: Items[]) =>
    test(`should have ${count} rows`, () => {
        expect(layout).toHaveLength(count)
    })

const strictColTest = (count: number, layout: Items[]) =>
    test(`should have ${count} items in each row`, () => {
        layout.forEach(row =>
            expect(row).toHaveLength(count)
        )
    })

const variableColTest = (cols: number[], layout: Items[]) =>
    test(`should have either ${cols.join(' or ')} items in each row`, () => {
        layout.forEach(row =>
            expect(cols).toContain(row.length)
        )
    })

const strictOrderTest = (xs: Items, ys: Items) =>
    test('should have both columns and rows in ascending order', () => {
        xs.forEach((item, i) => {
            expect(item.x).toBe(ys[i].x)
            expect(item.y).toBe(ys[i].y)
        })
    })

const run = (description: string, layoutFn: (items: Items) => Items[], test: (items: Items, layout: Items[]) => void, items: Items) => {
    const ordered = layoutFn(items)
    const reversed = layoutFn(
        items.reduceRight<Items>((a, b) => ([...a, b]), [])
    )

    describe(description, () => {
        describe('ordered', () => test(items, ordered))
        describe('reversed', () => test(items, reversed))
    })
}

describe('fn', () => {
    describe('groupByRow', () => {
        run(
            '3x3 matrix with unique columns and rows',
            groupByRow,
            (items: Items, layout: Items[]) => {
                strictColTest(3, layout)
                strictRowTest(3, layout)
                strictOrderTest(items, layout.flat())
            },
            templateToItems(size, [
                [[0, 0], [1, 0], [2, 0]],
                [[0, 1], [1, 1], [2, 1]],
                [[0, 2], [1, 2], [2, 2]]
            ])
        )

        run(
            '3x4 matrix with duplicate columns or rows',
            groupByRow,
            (items: Items, layout: Items[]) => {
                variableColTest([3, 6], layout)
                strictRowTest(3, layout)
                strictOrderTest(items, layout.flat())
            },
            templateToItems(size, [
                [[0, 0], [1, 0], [2, 0]],
                [[0, 0], [1, 0], [2, 0]],
                [[0, 1], [1, 1], [2, 1]],
                [[0, 2], [1, 2], [2, 2]]
            ])
        )
    })

    describe('getLayout', () => {
        const base = templateToItems(size, [
            [[0, 0], [1, 0], [2, 0]],
            [[0, 1], [1, 1], [2, 1]],
            [[0, 2], [1, 2], [2, 2]],
            [[0, 3], [1, 3], [2, 3]]
        ])

        describe('3x4 matrix with uniques items with other templates', () => {
            run(
                'identical',
                v => getLayout({
                    desktop: {
                        edited: true,
                        items: v,
                        width: 0,
                        height: 0
                    },
                    tablet: {
                        edited: true,
                        items: v,
                        width: 0,
                        height: 0
                    },
                    mobile: {
                        edited: true,
                        items: v,
                        width: 0,
                        height: 0
                    }
                }),
                (items: Items, layout: Items[]) => {
                    strictColTest(3, layout)
                    strictRowTest(4, layout)
                    strictOrderTest(items, layout.flat())
                },
                base
            )

            run(
                'trimmed',
                v => getLayout({
                    desktop: {
                        edited: true,
                        items: v,
                        width: 0,
                        height: 0
                    },
                    tablet: {
                        edited: true,
                        items: v.slice(1),
                        width: 0,
                        height: 0
                    },
                    mobile: {
                        edited: true,
                        items: v.slice(0, -1),
                        width: 0,
                        height: 0
                    }
                }),
                (items: Items, layout: Items[]) => {
                    strictColTest(3, layout)
                    strictRowTest(4, layout)
                    strictOrderTest(items, layout.flat())
                },
                base
            )

            run(
                'reversed',
                v => {
                    const reversed = v
                        .reduceRight<Items>((a, b) => ([...a, b]), [])
                        .map((s, i) => {
                            return { ...s, x: v[i].x, y: v[i].y }
                        })

                    return getLayout({
                        desktop: {
                            edited: true,
                            items: v,
                            width: 0,
                            height: 0
                        },
                        tablet: {
                            edited: true,
                            items: reversed,
                            width: 0,
                            height: 0
                        },
                        mobile: {
                            edited: true,
                            items: reversed,
                            width: 0,
                            height: 0
                        }
                    })
                },
                (items: Items, layout: Items[]) => {
                    strictColTest(12, layout)
                    strictRowTest(1, layout)
                    strictOrderTest(items, layout.flat())
                },
                base
            )

            run(
                'had unequal number of rows',
                v => {
                    const tablet = templateToItems(size, [
                        [[0, 4], [1, 4], [2, 4]]
                    ])
                    const mobile = templateToItems(size, [
                        [[0, 5], [1, 5], [2, 5]]
                    ])
                    return getLayout({
                        desktop: {
                            edited: true,
                            items: v,
                            width: 0,
                            height: 0
                        },
                        tablet: {
                            edited: true,
                            items: [...v, ...tablet],
                            width: 0,
                            height: 0
                        },
                        mobile: {
                            edited: true,
                            items: [...v, ...tablet, ...mobile],
                            width: 0,
                            height: 0
                        }
                    })
                },
                (items: Items, layout: Items[]) => {
                    strictColTest(3, layout)
                    strictRowTest(6, layout)
                    strictOrderTest(items, layout.flat())
                },
                base
            )

            run(
                'had switched rows in the middle',
                v => {
                    const grouped = groupByRow(v)
                    const a = grouped[1]
                    const b = grouped[2]
                    const top = b.map((v, i) => {
                        return { ...v, x: a[i].x, y: a[i].y }
                    })
                    const bottom = a.map((v, i) => {
                        return { ...v, x: b[i].x, y: b[i].y }
                    })
                    const switched = grouped
                        .toSpliced(1, 1, top)
                        .toSpliced(2, 1, bottom)
                        .flat()

                    return getLayout({
                        desktop: {
                            edited: true,
                            items: v,
                            width: 0,
                            height: 0
                        },
                        tablet: {
                            edited: true,
                            items: switched,
                            width: 0,
                            height: 0
                        },
                        mobile: {
                            edited: true,
                            items: v,
                            width: 0,
                            height: 0
                        }
                    })
                },
                (items: Items, layout: Items[]) => {
                    variableColTest([3, 6], layout)
                    strictRowTest(3, layout)
                    strictOrderTest(items, layout.flat())
                },
                base
            )

            run(
                'had unequal number of rows and columns',
                v => {
                    const tablet = templateToItems(size, [
                        [[0, 4], [2, 4]]
                    ])
                    const mobile = templateToItems(size, [
                        [[1, 5]]
                    ])
                    return getLayout({
                        desktop: {
                            edited: true,
                            items: v,
                            width: 0,
                            height: 0
                        },
                        tablet: {
                            edited: true,
                            items: [...v, ...tablet],
                            width: 0,
                            height: 0
                        },
                        mobile: {
                            edited: true,
                            items: [...v, ...mobile],
                            width: 0,
                            height: 0
                        }
                    })
                },
                (items: Items, layout: Items[]) => {
                    variableColTest([1, 2, 3], layout)
                    strictRowTest(6, layout)
                    strictOrderTest(items, layout.flat())
                },
                base
            )

            run(
                'had unique item inserted at the middle',
                v => {
                    const unique = templateToItems(size, [
                        [[1, 2]]
                    ])
                    return getLayout({
                        desktop: {
                            edited: true,
                            items: v,
                            width: 0,
                            height: 0
                        },
                        tablet: {
                            edited: true,
                            items: [...v, ...unique],
                            width: 0,
                            height: 0
                        },
                        mobile: {
                            edited: true,
                            items: v,
                            width: 0,
                            height: 0
                        }
                    })
                },
                (items: Items, layout: Items[]) => {
                    variableColTest([1, 3], layout)
                    strictRowTest(5, layout)
                    strictOrderTest(
                        items,
                        layout.toSpliced(2, 1).flat()
                    )
                },
                templateToItems(size, [
                    [[0, 0], [1, 0], [2, 0]],
                    [[0, 1], [1, 1], [2, 1]],
                    [[0, 3], [1, 3], [2, 3]],
                    [[0, 4], [1, 4], [2, 4]]
                ])
            )
        })
    })

    describe('resize', () => {
        test('should not change the size or position of an item if scale is 1', () => {
            const result = resize(sizeExtent, translateExtent, origin, 1, item)

            expect(result.x).toBe(item.x)
            expect(result.y).toBe(item.y)
            expect(result.w).toBe(item.w)
            expect(result.h).toBe(item.h)
        })

        describe('should change the size of an item & constrain it within its container', () => {
            describe('scale-up', () => {
                test('should make item bigger but not bigger than its constrain', () => {
                    ups.map(scale =>
                        resize(sizeExtent, translateExtent, origin, scale, item)
                    ).forEach(result => {
                        expect(result.w).greaterThan(item.w)
                        expect(result.h).greaterThan(item.h)
                        expect(result.w).lessThanOrEqual(maxWidth)
                        expect(result.h).lessThanOrEqual(maxHeight)
                        expect(result.x).greaterThanOrEqual(canvas.x)
                        expect(result.y).greaterThanOrEqual(canvas.y)
                        expect(result.x + result.w).lessThanOrEqual(canvas.x + canvas.w)
                        expect(result.y + result.h).lessThanOrEqual(canvas.y + canvas.h)
                    })
                })
            })
            describe('scale-down', () => {
                test('should make item smaller but not smaller than its constrain', () => {
                    downs.map(scale =>
                        resize(sizeExtent, translateExtent, origin, scale, item)
                    ).forEach(result => {
                        expect(result.w).lessThan(item.w)
                        expect(result.h).lessThan(item.h)
                        expect(result.w).greaterThanOrEqual(minWidth)
                        expect(result.h).greaterThanOrEqual(minHeight)
                        expect(result.x).greaterThanOrEqual(canvas.x)
                        expect(result.y).greaterThanOrEqual(canvas.y)
                        expect(result.x + result.w).lessThanOrEqual(canvas.x + canvas.w)
                        expect(result.y + result.h).lessThanOrEqual(canvas.y + canvas.h)
                    })
                })
            })
        })

        describe('should not move the origin', () => {
            test('scale-up', () => {
                points.forEach(([a, b], i) => {
                    const result = resize(sizeExtent, translateExtent, [a, b], 1.2, item)
                    const [c, d] = origins(result)[i].map(trunc)

                    expect(a).toBe(c)
                    expect(b).toBe(d)
                    expect(result.w).greaterThan(item.w)
                    expect(result.h).greaterThan(item.h)
                })
            })
            test('scale-down', () => {
                points.forEach(([a, b], i) => {
                    const result = resize(sizeExtent, translateExtent, [a, b], .8, item)
                    const [c, d] = origins(result)[i].map(trunc)

                    expect(a).toBe(c)
                    expect(b).toBe(d)
                    expect(result.w).lessThan(item.w)
                    expect(result.h).lessThan(item.h)
                })
            })
        })
    })

    describe('crop', () => {
        describe('should change the size of an item & constrain it within its container', () => {
            const corner = corners(item)
            const center = centers(item)
            const xs = center.slice(0, 2)
            const ys = center.slice(2, 4)
            const fn = crop(sizeExtent, translateExtent)

            const constrainTest = (canvas: Box, result: Item) => {
                expect(result.x).greaterThanOrEqual(image.x)
                expect(result.x).greaterThanOrEqual(canvas.x)
                expect(result.x + result.w).lessThanOrEqual(image.x + image.w)
                expect(result.x + result.w).lessThanOrEqual(canvas.x + canvas.w)
                expect(result.sx).greaterThanOrEqual(0)
                expect(result.sy).greaterThanOrEqual(0)
                expect(result.sw).lessThanOrEqual(1)
                expect(result.sh).lessThanOrEqual(1)
            }

            describe('scale-up', () => {
                test('should make item bigger but not bigger than its constrain', () => {
                    corner.forEach((point, i) => {
                        const result = fn(point, 3, 3, image, item)
                        const [a, b] = point
                        const [c, d] = corners(result)[i]

                        expect(a).toBe(c)
                        expect(b).toBe(d)
                        expect(result.w).greaterThan(item.w)
                        expect(result.h).greaterThan(item.h)
                        constrainTest(canvas, result)
                    })
                    xs.forEach((point, i) => {
                        const result = fn(point, 3, 1, image, item)
                        const [a, b] = point
                        const [c, d] = centers(result).slice(0, 2)[i]

                        expect(a).toBe(c)
                        expect(b).toBe(d)
                        expect(result.w).greaterThan(item.w)
                        expect(result.h).toBe(item.h)
                        constrainTest(canvas, result)
                    })
                    ys.forEach((point, i) => {
                        const result = fn(point, 1, 3, image, item)
                        const [a, b] = point
                        const [c, d] = centers(result).slice(2, 4)[i]

                        expect(a).toBe(c)
                        expect(b).toBe(d)
                        expect(result.w).toBe(item.w)
                        expect(result.h).greaterThan(item.h)
                        constrainTest(canvas, result)
                    })
                })
            })

            describe('scale-down', () => {
                test('should make item smaller but not smaller than its constrain', () => {
                    corner.forEach((point, i) => {
                        const result = fn(point, -3, -3, image, item)
                        const [a, b] = point
                        const [c, d] = corners(result)[i]

                        expect(a).toBe(c)
                        expect(b).toBe(d)
                        expect(result.w).lessThan(item.w)
                        expect(result.h).lessThan(item.h)
                        expect(result.w).greaterThanOrEqual(minWidth)
                        expect(result.w).greaterThanOrEqual(minHeight)
                        constrainTest(canvas, result)
                    })
                    xs.forEach((point, i) => {
                        const result = fn(point, -3, 1, image, item)
                        const [a, b] = point
                        const [c, d] = centers(result).slice(0, 2)[i]

                        expect(a).toBe(c)
                        expect(b).toBe(d)
                        expect(result.w).lessThan(item.w)
                        expect(result.h).toBe(item.h)
                        expect(result.w).greaterThanOrEqual(minWidth)
                        expect(result.w).greaterThanOrEqual(minHeight)
                        constrainTest(canvas, result)
                    })
                    ys.forEach((point, i) => {
                        const result = fn(point, 1, -3, image, item)
                        const [a, b] = point
                        const [c, d] = centers(result).slice(2, 4)[i]

                        expect(a).toBe(c)
                        expect(b).toBe(d)
                        expect(result.w).toBe(item.w)
                        expect(result.h).lessThan(item.h)
                        expect(result.w).greaterThanOrEqual(minWidth)
                        expect(result.w).greaterThanOrEqual(minHeight)
                        constrainTest(canvas, result)
                    })
                })
            })
        })
    })

    describe('snapLines', () => {
        test('single box at the center of the canvas should produce 4 lines', () => {
            expect(snapLines(item, [canvas]).length).toBe(4)
        })

        test('two boxes with the same size vertically aligned should produce 4 lines', () => {
            const a = { ...item, y: 0 }
            const b = { ...item, y: size + 1 }

            expect(snapLines(a, [b]).length).toBe(4)
        })

        test('two boxes with the same size horizontally aligned should produce 4 lines', () => {
            const a = { ...item, x: 0 }
            const b = { ...item, x: size + 1 }

            expect(snapLines(a, [b]).length).toBe(4)
        })
    })

    describe('failed test', () => {
        test('1 + 1 = 3', () => {
            expect(1 + 1).toBe(3)
        })
    })
})