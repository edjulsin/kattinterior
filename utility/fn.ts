import { Item, Items, Template } from '@/type/editor'
import { timeDay, timeHour, timeMinute, timeMonth, timeWeek, timeYear } from 'd3'

export const curry = (fn: Function) => (...xs: any[]) =>
    xs.length >= fn.length
        ? fn(...xs)
        : (...ys: any[]) => curry(fn)(...xs, ...ys)

export const o = (a: Function, b: Function) => (c: any) => a(
    b(c)
)
export const first = ([v]: any[]) => v
export const last = (v: any[]) => v[v.length - 1]

export const compose = (...fns: Function[]) => (...args: any[]) =>
    fns.slice(0, -1).reduceRight(
        (a, b) => b(a),
        fns[fns.length - 1](...args)
    )

export const clamp = (min: number, max: number, value: number) => Math.min(Math.max(min, value), max)

export type Box = { x: number, y: number, w: number, h: number }

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

export const applyBoxConstrain = <T extends Box>(container: Box | T, item: T): T => {
    const { dx, dy } = boxConstrain(container, item)
    return {
        ...item,
        x: item.x - dx,
        y: item.y - dy,
    }
}

export type Tuple = [any, any]

export const between = (min: number, max: number, value: number) => Math.min(Math.max(min, value), max) === value

export const xs = (item: Item): Tuple => ([item.x, item.x + item.w])
export const ys = (item: Item): Tuple => ([item.y, item.y + item.h])

export const minMax = (values: number[]): Tuple => ([
    Math.min(...values),
    Math.max(...values)
])

export const overlap = curry((fn: (item: Item) => Tuple, a: Item, b: Item): boolean => {
    const c = fn(a)
    const d = fn(b)
    return c.map(v => between(...d, v)).includes(true) || d.map(v => between(...c, v)).includes(true)
})

export const overlapX = overlap(xs)
export const overlapY = overlap(ys)
export const overlapXY = overlap((v: Item) => {
    return [...xs(v), ...ys(v)]
})

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

export const extent = <T,>(fn: (item: T) => Tuple, items: T[]): Tuple => items
    .reduce(
        ([min, max], b) => {
            const [c, d] = fn(b)
            return [Math.min(min, c), Math.max(max, d)]
        },
        [Infinity, -Infinity]
    )
    .map(v => Number.isFinite(v) ? v : 0) as Tuple



export const extents = <T, R>(fn: (item: T) => [Tuple, Tuple], items: T[]): [Tuple, Tuple] => items
    .reduce(
        ([[sx, sy], [ex, ey]], b) => {
            const [[xMin, yMin], [xMax, yMax]] = fn(b)
            return [
                [Math.min(sx, xMin), Math.min(sy, yMin)],
                [Math.max(ex, xMax), Math.max(ey, yMax)]
            ]
        },
        [[Infinity, -Infinity], [Infinity, -Infinity]]
    )
    .map(v =>
        v.map(v => Number.isFinite(v) ? v : 0)
    ) as [Tuple, Tuple]

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

export const groupByRow = (items: Items): Items[] =>
    groupByOverlap(overlapY, items).map((v: Items) =>
        v.toSorted((a, b) => a.y - b.y)
    ).toSorted((a: Items, b: Items) => {
        const [c] = extent(ys, a)
        const [d] = extent(ys, b)
        return c - d
    })

export const rowTable = (rows: Items[]): Record<string, number> =>
    rows.reduce((a, b, i) => b.reduce((c, d) => ({ ...c, [d.id]: i }), a), {})

export const reduceJoins = (joins: Tuple[], acc: Tuple[]): Tuple[] => {
    const overlapped = (a: Tuple, b: Tuple) => b.some(c =>
        between(...a, c)
    )

    if(joins.length > 1) {
        const [x, y, ...rest] = joins.toSorted(([a], [b]) => a - b)
        if(overlapped(x, y)) {
            return reduceJoins([minMax([...x, ...y]), ...rest], acc)
        } else {
            return reduceJoins([y, ...rest], [...acc, x])
        }
    } else {
        return [...acc, ...joins]
    }
}

export const layoutJoins = (xs: Items[], ys: Items[]): Tuple[] => {
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
        (a, b, c: Tuple[]) => {
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

    const changes = joins.map(([a, b]) =>
        desktop.slice(a, b + 1).flat()
    )

    const unchanges = desktop.filter((_, i) =>
        !joins.some(v =>
            between(...v, i)
        )
    )

    const rows = [...changes, ...unchanges]
        .map(v => v.toSorted((a, b) => a.y - b.y))
        .toSorted(([a], [b]) => a.y - b.y)

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