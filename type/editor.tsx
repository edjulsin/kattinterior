export type Item = {
    z: number,
    x: number,
    y: number,
    w: number,
    h: number,
    sx: number,
    sy: number,
    sw: number,
    sh: number,
    bw: number,
    bh: number
}

export type Items = Item[]

export type Layout = {
    cols: number,
    rows: number,
    items: Items
}

export type Template = {
    className: string,
    breakpoint: number,
    grid: number,
    edited: boolean,
    layout: Layout
}

export type Templates = Record<string, Template>

