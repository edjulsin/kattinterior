import { Item, Items, Template, Project, Photos, Extent, Point, Points, Box, UniqueBox, Line, Lines } from '@/type/editor'
import { timeDay, timeHour, timeMinute, timeMonth, timeWeek, timeYear } from 'd3'
import { v7 as UUIDv7 } from 'uuid'
import fallback from '@/assets/fallback.svg'

export const curry = <F extends (...args: any[]) => any>(fn: F) => {
    const curried = (...xs: any[]) =>
        xs.length >= fn.length
            ? fn(...xs)
            : (...ys: any[]) => curried(...xs, ...ys)

    return curried
}

export const o = curry((a: (v: any) => any, b: (v: any) => any, c: any) =>
    a(
        b(c)
    )
)

export const first = ([v]: any[]) => v
export const last = (v: any[]) => v[v.length - 1]

export const clamp = (min: number, max: number, value: number) =>
    Math.min(Math.max(min, value), max)

export const between = (min: number, max: number, value: number) =>
    clamp(min, max, value) === value

export const isInsideBox = (box: Box, x: number, y: number) =>
    between(box.x, box.x + box.w, x) && between(box.y, box.y + box.h, y)

export const boxConstrain = (container: Box, item: Box) => {
    const dx0 = item.x - container.x
    const dx1 = (item.x + item.w) - (container.x + container.w)
    const dy0 = item.y - container.y
    const dy1 = (item.y + item.h) - (container.y + container.h)
    return {
        dx: dx1 > dx0 ? (dx0 + dx1) / 2 : Math.min(0, dx0) || Math.max(0, dx1),
        dy: dy1 > dy0 ? (dy0 + dy1) / 2 : Math.min(0, dy0) || Math.max(0, dy1)
    }
}

export const applyBoxConstrain = <T extends Box>(container: Box, item: T): T => {
    const { dx, dy } = boxConstrain(container, item)
    return {
        ...item,
        x: item.x - dx,
        y: item.y - dy,
    }
}

export const xs = (item: Box): Point => ([item.x, item.x + item.w])
export const ys = (item: Box): Point => ([item.y, item.y + item.h])

export const minMax = (values: number[]): Point => ([
    Math.min(...values),
    Math.max(...values)
])

export const overlap = curry((fn: (item: any) => Point, a: any, b: any): boolean => {
    const c = fn(a)
    const d = fn(b)
    const e = [
        ...c.map(v =>
            between(...d, v)
        ),
        ...d.map(v =>
            between(...c, v)
        )
    ]
    return e.includes(true)
})

export const overlapX = overlap(xs)
export const overlapY = overlap(ys)

export const groupByOverlap = curry((overlap: (a: Item, b: Item) => boolean, items: Items) => {
    if(items.length > 0) {
        const byItem = (items: Items, acc: Items[]) => {
            if(items.length > 0) {
                const [x, ...xs] = items
                const ys = xs.filter(y =>
                    overlap(x, y)
                )
                return byItem(xs, [...acc, [x, ...ys]])
            } else {
                return acc
            }
        }
        const byGroup = (groups: Items[], acc: Items[]) => {
            if(groups.length > 0) {
                const [x, ...xs] = groups
                const [a, b] = xs.reduce<[Items, Items[]]>(([a, b], c) => {
                    if(c.some(x => a.some(y => x.id === y.id))) {
                        const r = [...a, ...c].reduce<Items>((a, b) =>
                            a.some(x => x.id === b.id)
                                ? a
                                : a.concat([b])
                            ,
                            []
                        )
                        return [r, b]
                    } else {
                        return [a, [...b, c]]
                    }
                }, [x, []])

                return byGroup(b, [...acc, a])
            } else {
                return acc
            }
        }

        return byGroup(byItem(items, []), [])
    } else {
        return []
    }
})

export const extent = (fn: (item: Item) => Point, items: Items): Point =>
    items.reduce(
        ([min, max], b) => {
            const [c, d] = fn(b)
            return [Math.min(min, c), Math.max(max, d)]
        },
        [Infinity, -Infinity]
    )

export const eqBy = curry((by: (v: any) => any, a: any, b: any) =>
    by(a) === by(b)
)

export const ab = <T, R>(fn: (a: T, b: T, c: R[]) => R[], values: T[], acc: R[]): R[] => {
    if(values.length > 1) {
        const [a, b, ...next] = values
        return ab(
            fn,
            [b, ...next],
            fn(a, b, acc)
        )
    } else {
        return acc
    }
}

export const sortLayout = (layout: Items[]) =>
    layout.map(v =>
        v.toSorted((a, b) =>
            Math.sign(a.x - b.x) + Math.sign(a.y - b.y)
        )
    ).toSorted((a: Items, b: Items) => {
        const [c] = extent(ys, a)
        const [d] = extent(ys, b)
        return c - d
    })

export const groupByRow = (items: Items): Items[] =>
    sortLayout(
        groupByOverlap(overlapY, items)
    )

export const rowTable = (rows: Items[]): Record<string, number> =>
    rows.reduce((a, b, i) => b.reduce((c, d) => ({ ...c, [d.id]: i }), a), {})

export const reduceJoins = (joins: Point[], acc: Point[]): Point[] => {
    if(joins.length > 1) {
        const [x, y, ...rest] = joins.toSorted(([a], [b]) => a - b)
        if(overlap((v: Points) => v, x, y)) {
            return reduceJoins([minMax([...x, ...y]), ...rest], acc)
        } else {
            return reduceJoins([y, ...rest], [...acc, x])
        }
    } else {
        return [...acc, ...joins]
    }
}

export const layoutJoins = (xs: Items[], ys: Items[]): Points => {
    const table = rowTable(xs)
    const _ys = ys.map(v =>
        v.filter(v => v.id in table)
    )

    const rows = _ys.map(v =>
        v.map(v => table[v.id]).reduce<number[]>(
            (a, b) => a.some(c => b === c)
                ? a
                : a.concat([b]),
            []
        )
    )

    const byRow = rows.filter(v => v.length > 1).map(minMax)

    const byRows = ab(
        (a, b, c: Point[]) => {
            if(a.some(x => b.some(y => x > y))) {
                return [...c, minMax([...a, ...b])]
            } else {
                return c
            }
        },
        rows,
        []
    )

    return reduceJoins([...byRow, ...byRows], [])
}

export const twice = (v: number) => v * 2

export const getLayout = (template: Template) => {
    const desktop = groupByRow(template.desktop.items)
    const tablet = groupByRow(template.tablet.items)
    const mobile = groupByRow(template.mobile.items)

    const joins = reduceJoins(
        [
            ...layoutJoins(desktop, tablet),
            ...layoutJoins(desktop, mobile)
        ],
        []
    )

    const unchanges = desktop.filter((_, i) =>
        !joins.some(v =>
            between(...v, i)
        )
    )

    const changes = joins.map(([a, b]) =>
        desktop.slice(a, b + 1).flat()
    )

    const rows = sortLayout([...unchanges, ...changes])

    const reduceLayout = (a: Items[], b: Items[]) => {
        const tableA = rowTable(a)
        const tableB = rowTable(b)
        const update = (row: number, items: Items, rows: Items[]) =>
            rows.with(row, [...rows[row], ...items])

        const insert = (row: number, items: Items, rows: Items[]) =>
            rows.toSpliced(row, 0, items)

        const [withSiblings, withoutSiblings] = b.reduce<[Items[], Items[]]>(([a, b], c) => { // get row with unique items
            if(c.every(v => v.id in tableA)) {
                return [a, b]
            } else {
                if(c.some(v => v.id in tableA)) {
                    return [[...a, c], b]
                } else {
                    return [a, [...b, c]]
                }
            }
        }, [[], []])

        return withoutSiblings.reduce(
            (e, f) => {
                const ref = rowTable(e)
                const [unique] = f
                const i = tableB[unique.id]
                const before = ((i - 1) in b ? b.slice(0, i).flat() : ([])).filter(v => v.id in ref).map(v => ref[v.id])
                const after = ((i + 1) in b ? b.slice(i + 1).flat() : ([])).filter(v => v.id in ref).map(v => ref[v.id])
                const joined = before.filter(x =>
                    after.some(y => x === y)
                )
                if(joined.length > 0) {
                    const [j] = joined
                    return update(j, f, e)
                } else {
                    const j = before.length > 0 ? Math.max(...before) + 1 : 0
                    return insert(j, f, e)
                }
            },
            withSiblings.reduce((c, d) => {
                const [[exist], uniques] = d.reduce<[Items, Items]>(([a, b], c) => {
                    if(c.id in tableA) {
                        return [[...a, c], b]
                    } else {
                        return [a, [...b, c]]
                    }
                }, [[], []])
                const row = tableA[exist.id]
                return update(row, uniques, c)
            }, a)
        )
    }

    return [tablet, mobile].reduce(reduceLayout, rows)
}

export const throttle = <T extends any[]>(delay: number, callback: (...args: T) => any) => {
    let prev = performance.now()
    return (...args: T) => {
        const curr = performance.now()
        const diff = curr - prev
        if(diff >= delay) {
            prev = curr
            callback(...args)
        }
    }
}

export const debounce = <T extends any[]>(delay: number, callback: (...args: T) => any) => {
    let timeout = setTimeout(() => { }, 0, null)
    return (...args: any[]) => {
        clearTimeout(timeout)
        timeout = setTimeout(callback, delay, ...args)
    }
}

export const animate = (duration: number, callback: (number: number) => void) => {
    const _animate = (i: number, end: number, callback: (number: number) => void) =>
        requestAnimationFrame(time => {
            if(time <= end) {
                callback(i)
                _animate(i + 1, end, callback)
            }
        })

    requestAnimationFrame(time =>
        _animate(0, time + duration, callback)
    )
}

export const alt = (alt: string) => capitalize(alt.trim()) || 'Interior'

export const toStorageURL = (path: string) =>
    `${process.env.NEXT_PUBLIC_SUPABASE_URL!}/storage/v1/object/public/${process.env.NEXT_PUBLIC_SUPABASE_BUCKET!}/${path}`

export const toPathURL = (url: string) => url.split('/').slice(-2).join('/')

export const getItemsHeight = (items: Items) =>
    Math.max(
        ...items.map(v => v.y + v.h).concat([0])
    )

export const getItemsWidth = (items: Items) =>
    Math.max(
        ...items.map(v => v.x + v.w).concat([0])
    )

export function storageAvailable(type: 'sessionStorage' | 'localStorage') {
    let storage;
    try {
        storage = window[type]
        const x = '__storage_test__'
        storage.setItem(x, x)
        storage.removeItem(x)
        return true;
    } catch(e) {
        return (
            e instanceof DOMException &&
            e.name === 'QuotaExceededError' &&
            // acknowledge QuotaExceededError only if there's something already stored
            storage &&
            storage.length !== 0
        )
    }
}

export const formatISODate = (now: Date, time: string) => {
    const date = new Date(time)
    const years = timeYear.count(date, now)
    const months = timeMonth.count(date, now)
    const weeks = timeWeek.count(date, now)
    const days = timeDay.count(date, now)
    const hours = timeHour.count(date, now)
    const minutes = timeMinute.count(date, now)
    const year = `${years} year${years > 1 ? 's' : ''} ago`
    const month = `${months} month${months > 1 ? 's' : ''} ago`
    const week = `${weeks} month${weeks > 1 ? 's' : ''} ago`
    const day = `${days} day${days > 1 ? 's' : ''} ago`
    const hour = `${hours} hour${hours > 1 ? 's' : ''} ago`
    const minute = `${minutes} minute${minutes > 1 ? 's' : ''} ago`
    return years > 0 ? year : months > 0 ? month : weeks > 0 ? week : days > 0 ? day : hours > 0 ? hour : minute
}

export const capitalize = (string: string) => {
    const splitted = string.split(' ').filter(v => v)
    const capitalized = splitted.map(([x, ...xs]) => {
        return [x.toUpperCase(), ...xs].join('')
    })
    return capitalized.join(' ')
}

export const half = (v: number) => v * .5

export const defaultThumbnail = () => ({
    id: UUIDv7(),
    src: fallback,
    alt: 'Fallback thumbnail',
    width: 29,
    height: 29,
    thumbnail: false
})

export const counts = <T>(callback: (count: number) => T, count: number, acc: T[]): T[] =>
    count === 0
        ? acc
        : counts(callback, count - 1, [...acc, callback(count - 1)])

export const getThumbnails = (count: number, project: Project) => {
    const table = Object.fromEntries(
        project.assets.map(v => {
            return [v.id, v]
        })
    )

    const images = project
        .template
        .desktop
        .items
        .toSorted((a, b) => a.y - b.y)
        .reduce<Photos>(
            (a, b) => {
                const photo = table[b.src]
                return photo.thumbnail ? a : a.concat([photo])
            },
            project.assets.filter(v => v.thumbnail)
        )
        .slice(0, count)

    const options = [
        ...images,
        ...counts(() => defaultThumbnail(), count, [])
    ]

    return options.slice(0, count)
}

export const isBoxesIntersect = (a: Box, b: Box) =>
    overlapX(a, b) && overlapY(a, b)

export const splitChildrenAsBoxes = (parent: HTMLElement) => {
    const c = parent.getBoundingClientRect()
    return [...parent.children].reduce<[UniqueBox[], UniqueBox[]]>(([a, b], e, i) => {
        const el = e as HTMLElement
        const r = e.getBoundingClientRect()
        const box = {
            id: el.dataset.id!,
            i: i,
            x: r.x - c.x,
            y: r.y - c.y,
            w: r.width,
            h: r.height
        }
        if(el.dataset.active === 'true') {
            return [[...a, box], b]
        } else {
            return [a, [...b, box]]
        }
    }, [[], []])
}

export const generateItemBoxes = ({ container, item, image }: { container: HTMLElement, item: HTMLElement, image: HTMLElement }) => {
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
            id: item.dataset.id!,
            src: item.dataset.src!,
            z: Number(item.dataset.z),
            x: it.x - co.x,
            y: it.y - co.y,
            w: it.width,
            h: it.height,
            sx: (it.x - im.x) / im.width,
            sy: (it.y - im.y) / im.height,
            sw: it.width / im.width,
            sh: it.height / im.height,
            effect: item.dataset.effect as string
        },
        image: {
            x: im.x - co.x,
            y: im.y - co.y,
            w: im.width,
            h: im.height
        }
    }
}

export const bottomCenter = (item: Item): Point => ([item.x + half(item.w), item.y + item.h])
export const topCenter = (item: Item): Point => ([item.x + half(item.w), item.y])
export const rightCenter = (item: Item): Point => ([item.x + item.w, item.y + half(item.h)])
export const leftCenter = (item: Item): Point => ([item.x, item.y + half(item.h)])
export const bottomRight = (item: Item): Point => ([item.x + item.w, item.y + item.h])
export const bottomLeft = (item: Item): Point => ([item.x, item.y + item.h])
export const topLeft = (item: Item): Point => ([item.x, item.y])
export const topRight = (item: Item): Point => ([item.x + item.w, item.y])

export const resize = curry(([[wMin, wMax], [hMin, hMax]]: Extent, [[xMin, xMax], [yMin, yMax]]: Extent, [ox, oy]: Point, scale: number, item: Box) => {
    const c = clamp(
        Math.max(wMin / item.w, hMin / item.h),
        Math.min(wMax / item.w, hMax / item.h),
        scale
    )
    return applyBoxConstrain(
        { x: xMin, y: yMin, w: xMax - xMin, h: yMax - yMin },
        {
            ...item,
            x: ox - (ox - item.x) * c,
            y: oy - (oy - item.y) * c,
            w: item.w * c,
            h: item.h * c
        }
    )
})

export const trunc = Math.trunc

export const crop = curry(([[wMin, wMax], [hMin, hMax]]: Extent, [[xMin, xMax], [yMin, yMax]]: Extent, [ox, oy]: Point, dx: number, dy: number, image: Box, item: Item) => {
    const l = Math.max(xMin, image.x)
    const t = Math.max(yMin, image.y)
    const r = Math.min(xMax, image.x + image.w)
    const b = Math.min(yMax, image.y + image.h)
    const ld = item.x - l
    const rd = r - (item.x + item.w)
    const td = item.y - t
    const bd = b - (item.y + item.h)
    const cx = item.x + half(item.w)
    const cy = item.y + half(item.h)
    const xs = 1 + ([ld, 0, rd][1 + Math.sign(cx - ox)]) / item.w
    const ys = 1 + ([td, 0, bd][1 + Math.sign(cy - oy)]) / item.h
    const xx = clamp(wMin / item.w, Math.min(xs, wMax / item.w), dx)
    const yy = clamp(hMin / item.h, Math.min(ys, hMax / item.h), dy)
    const x = Math.max(ox - (ox - item.x) * xx, xMin)
    const y = Math.max(oy - (oy - item.y) * yy, yMin)
    const w = clamp(wMin, wMax, item.w * xx)
    const h = clamp(hMin, hMax, item.h * yy)
    const sx = Math.max((x - image.x) / image.w, 0)
    const sy = Math.max((y - image.y) / image.h, 0)
    const sw = Math.min(w / image.w, 1)
    const sh = Math.min(h / image.h, 1)
    return { ...item, x, y, w, h, sx, sy, sw, sh }
})

export const corners = ({ x, y, w, h }: Box): Points => ([
    [x, y],
    [x + w, y],
    [x + w, y + h],
    [x, y + h]
])

export const center = ({ x, y, w, h }: Box): Point => ([x + w * .5, y + h * .5])

export const centers = ({ x, y, w, h }: Box): Points => ([
    [x, y + h * .5],
    [x + w, y + h * .5],
    [x + w * .5, y],
    [x + w * .5, y + h]
])

export const eq = (a: number, b: number) => Math.round(a) === Math.round(b)

export const origins = (item: Box) => ([...corners(item), ...centers(item)])

export const smaller = (a: number, b: number): number => {
    const [e] = [a, b].toSorted((a, b) =>
        Math.abs(a) - Math.abs(b)
    )
    return e
}

export const sequences = <T>(cb: (item: T, index: number) => void, items: T[]) =>
    items.reduce(
        (a, b, i) => a.then(() =>
            cb(b, i)
        ),
        Promise.resolve()
    )

export const smallest = (a: Box, b: Box): Point => {
    const reducer = (xs: number[], ys: number[]) => {
        const [x, ...xss] = xs
        const [y, ...yss] = ys
        const initial = yss.reduce((a, b) => smaller(a, b - x), y - x)
        return xss.reduce((a, b) => ys.reduce((c, d) => smaller(c, d - b), a), initial)
    }
    const xs = (box: Box) => ([box.x, box.x + box.w * .5, box.x + box.w])
    const ys = (box: Box) => ([box.y, box.y + box.h * .5, box.y + box.h])
    const axs = xs(a)
    const ays = ys(a)
    const bxs = xs(b)
    const bys = ys(b)
    const ox = reducer(axs, bxs)
    const oy = reducer(ays, bys)
    return [ox, oy]
}

export const snap = (threshold: number, box: Box, boxes: Box[]): Point => {
    if(boxes.length === 0) {
        return [0, 0]
    } else {
        const [x, ...xs] = boxes
        const [a, b] = xs.reduce<Point>(
            ([px, py], x) => {
                const [cx, cy] = smallest(box, x)
                return [smaller(px, cx), smaller(py, cy)]
            },
            smallest(box, x)
        )
        const limit = (v: number) => Math.abs(v) <= threshold ? v : 0
        return [limit(a), limit(b)]
    }
}

export const intersections = ([ax, ay]: Point, points: Points) =>
    points.reduce<Lines>((acc, [ix, iy]) => {
        if(eq(ax, ix) || eq(ay, iy)) {
            return [...acc, [[ax, ay], [ix, iy]]]
        } else {
            return acc
        }
    }, [])

export const removeDuplicateLines = (lines: Lines, acc: Lines): Lines => {
    if(lines.length > 0) {
        const [x, ...xs] = lines
        const duplicate = ([, d]: Line, [, f]: Line) => {
            const [g, h] = d
            const [i, j] = f
            return eq(g, i) && eq(h, j)
        }
        const ys = xs.filter(y =>
            !duplicate(x, y)
        )
        return removeDuplicateLines(ys, [...acc, x])
    } else {
        return acc
    }
}

export const snapLines = (box: Box, boxes: Box[]) => {
    const xs = centers(box)
    return removeDuplicateLines(
        boxes.flatMap(box => {
            const ys = centers(box)
            return xs.flatMap(x =>
                intersections(x, ys)
            )
        }),
        []
    )
}