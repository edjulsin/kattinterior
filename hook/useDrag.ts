import { useRef, useLayoutEffect } from 'react'
import { select, drag, DragBehavior, D3DragEvent } from 'd3'
import { o } from '@/utility/fn'

export type UseDragBehavior<T extends HTMLElement> = DragBehavior<T, any, any>

export type UseDragEvent<T extends HTMLElement> = D3DragEvent<T, any, any>

export type UseDragListener = (event: any) => void

export type UseDragModifier<T extends HTMLElement> = (event: UseDragBehavior<T>) => UseDragBehavior<T>

export type UseDragTransform<T extends HTMLElement> = (event: UseDragEvent<T>) => any

export type DragPropsType<T extends HTMLElement> = {
    transform?: UseDragTransform<T>,
    modifier?: UseDragModifier<T>,
    onDragStart?: UseDragListener,
    onDrag?: UseDragListener,
    onDragEnd?: UseDragListener
}

export const useDrag = <T extends HTMLElement>({ transform, modifier, onDragStart, onDrag, onDragEnd }: DragPropsType<T>) => {
    const ref = useRef<T>(null!)

    useLayoutEffect(() => {
        const selection = select(ref.current)
        const callback = () => { }
        const behavior = (value: UseDragBehavior<T>) => value
        const transformer = (value: UseDragEvent<T>) => value

        const m = modifier ?? behavior
        const t = transform ?? transformer
        const [ a, b, c ] = [
            onDragStart,
            onDrag,
            onDragEnd
        ].map(v => v ?? callback).map(v =>
            o(v, t)
        )

        selection.call(
            m(
                drag<T, any>()
                    .on('start', a)
                    .on('drag', b)
                    .on('end', c)
            )
        )

        return () => { selection.on('.drag', null) }
    }, [])

    return ref
}
