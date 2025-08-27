export type Photo = {
    id: string,
    src: string,
    alt: string,
    width: number,
    height: number,
    thumbnail: boolean
}

export type Item = {
    id: string,
    src: string,
    z: number,
    x: number,
    y: number,
    w: number,
    h: number,
    sx: number,
    sy: number,
    sw: number,
    sh: number,
    effect: string
}

export type Items = Item[]

export type Photos = Photo[]

export type Layout = {
    edited: boolean,
    width: number,
    height: number,
    items: Items
}

export type Template = {
    desktop: Layout,
    tablet: Layout,
    mobile: Layout
}

export type Device = 'desktop' | 'tablet' | 'mobile'

export type Project = {
    id: string,
    created_at: string,
    updated_at: string,
    published_at: string,
    featured: boolean,
    published: boolean,
    category: 'Residential' | 'Commercial',
    name: string,
    location: string,
    story: string,
    tagline: string,
    slug: string,
    title: string,
    description: string,
    template: Template,
    assets: Photos
}

export type Asset = Record<string, Photo>