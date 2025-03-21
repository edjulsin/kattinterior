export type Item = {
    i: number,
    x: number,
    y: number,
    w: number,
    h: number,
    sx: number,
    sy: number
}

export type Layout = {
    cols: number,
    rows: number,
    items: Item[]
}

export type Template = {
    index: number,
    className: string,
    breakpoint: number,
    edited: boolean,
    layout: Layout
}

export type Templates = Template[]

