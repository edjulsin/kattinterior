import { useEffect } from 'react'

type Callback = (event: { x: number, y: number, dx: number, dy: number, elements: HTMLElement[] }) => void

const Scroll = ({ selectors, onScroll, children }: { selectors: string[], onScroll: Callback, children: React.ReactNode }) => {

    useEffect(() => {
        type State = {
            fired: boolean,
            x: number,
            y: number,
            dx: number,
            dy: number
        }
        const state = {
            fired: false,
            x: window.scrollX,
            y: window.scrollY,
            dx: 0,
            dy: 0
        }
        const elements = selectors.flatMap(v => {
            return [ ...document.querySelectorAll(v) ] as HTMLElement[]
        })
        const loop = (callback: Callback, state: State) =>
            requestAnimationFrame(() => {
                if(state.fired) {
                    state.fired = false
                    callback({
                        x: state.x,
                        y: state.y,
                        dx: state.dx,
                        dy: state.dy,
                        elements: elements
                    })
                    loop(callback, state)
                } else {
                    loop(callback, state)
                }
            })

        const update = (state: State) => () => {
            state.fired = true
            state.dx = window.scrollX - state.x
            state.dy = window.scrollY - state.y
            state.x = window.scrollX
            state.y = window.scrollY
        }

        const raf = loop(onScroll, state)

        const listener = update(state)

        window.addEventListener('scroll', listener)

        return () => {
            cancelAnimationFrame(raf)
            window.removeEventListener('scroll', listener)
        }
    }, [])

    return children
}

export default Scroll