import Image from 'next/image'


export default () => (
    <section className='grid grid-cols-[1fr_.1fr_.5fr_.1fr_1fr] grid-rows-2'>
        <Image
            className='w-80 object-center object-cover z-20 col-start-1 col-end-3 row-start-1 row-span-2 justify-self-end self-end'
            src='/chaterina/1.jpg'
            alt='Chaterina Working in an Art Gallery'
            width={ 1080 }
            height={ 1350 }
        />
        <Image
            className='size-80 object-left object-cover z-10 col-start-2 row-start-1 col-span-3 self-end justify-self-center'
            src='/chaterina/2.jpg'
            alt='Chaterina find inspirations in an Arts Gallery'
            width={ 1080 }
            height={ 1350 }
        />
        <Image
            className='w-50 h-70 object-center object-cover z-30 row-start-1 col-start-5 row-span-2 self-center justify-self-center'
            src='/chaterina/3.jpg'
            alt='Chaterina Working with a Client'
            width={ 1440 }
            height={ 1080 }
        />
    </section>
)



// useEffect(() => {
//     const canvas = canvasRef.current!
//     const context = contextRef.current!

//     const caches = layout.items.map(({ i, w, h, sx, sy }) => {
//         const width = w * grid
//         const height = h * grid
//         const canvas = new OffscreenCanvas(
//             Math.floor(width * devicePixelRatio),
//             Math.floor(height * devicePixelRatio)
//         )
//         const context = canvas.getContext('2d')!
//         const image = images[ i ]
//         const imageWidth = image.width
//         const imageHeight = image.height
//         const scale = Math.min(imageWidth / width, imageHeight / height) * grid

//         context.imageSmoothingEnabled = true
//         context.imageSmoothingQuality = 'high'

//         context.scale(dpr, dpr)
//         context.drawImage(
//             image,
//             Math.floor((imageWidth - w * scale) * sx),
//             Math.floor((imageHeight - h * scale) * sy),
//             Math.floor(w * scale),
//             Math.floor(h * scale),
//             0,
//             0,
//             Math.floor(width),
//             Math.floor(height)
//         )

//         return canvas
//     })
//     setCaches(caches)
//     drawLayout({
//         context: contextRef.current!,
//         images: caches,
//         items: layout.items,
//         grid: grid,
//         dpr: dpr
//     })
//     return () => resetCanvas({ canvas, context })
// }, [ images, grid, dpr ])

// useEffect(() => {
//     const canvas = canvasRef.current!
//     const context = contextRef.current!

//     drawLayout({
//         context: contextRef.current!,
//         images: caches,
//         items: layout.items,
//         grid: grid,
//         dpr: dpr
//     })

//     return () => resetCanvas({ canvas, context })
// }, [ layout.items ])