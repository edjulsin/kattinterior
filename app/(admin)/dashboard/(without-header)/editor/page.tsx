'use client'
import Link from 'next/link';
import AngleLeftIcon from '@/public/angleleft.svg'
import AngleDownIcon from '@/public/angledown.svg'
import LayoutIcon from '@/public/layout.svg'
import UploadIcon from '@/public/upload.svg'
import PreviewIcon from '@/public/preview.svg'
import ShareIcon from '@/public/share.svg'
import SendIcon from '@/public/send.svg'
import DeleteIcon from '@/public/delete.svg'
import GridIcon from '@/public/grid.svg'
import { AccessibleIcon } from '@radix-ui/react-accessible-icon';
import { useDropzone } from 'react-dropzone';
import React, { forwardRef, useEffect, useLayoutEffect, useMemo, useRef, useState, RefObject, Ref, ReactElement } from 'react';
import clsx from 'clsx';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { v7 as uuidv7 } from 'uuid'
import * as Tooltip from '@radix-ui/react-tooltip'

import { Item, Layout, Template, Templates } from '@/type/editor'
import Editor from '@/components/Editor';

import DesktopIcon from '@/public/desktop.svg'
import TabletIcon from '@/public/tablet.svg'
import MobileIcon from '@/public/mobile.svg'
import constrain from '@/utility/constrain';
import percent from '@/utility/percent';

const Droppable = ({ children, className = '', onDrop, noDragsEventBubbling = false, noClick = false }: Readonly<{ children: React.ReactNode, className?: string, onDrop: Function, noDragsEventBubbling?: boolean, noClick?: boolean }>) => {
	const { getRootProps, getInputProps } = useDropzone({
		accept: { 'image/*': [] },
		onDrop: files => onDrop(files),
		noDragEventsBubbling: noDragsEventBubbling,
		noClick: noClick
	})
	return (
		<div { ...getRootProps({ className }) }>
			<input { ...getInputProps() } />
			{ children }
		</div>
	)
}

const TextArea = ({ placeholder, className, value, onChange }: { placeholder?: string, className?: string, value?: string, onChange: Function }) => {
	const ref = useRef<HTMLTextAreaElement>(null)
	useEffect(() => {
		if(ref.current) {
			ref.current.style.height = '0px'
			ref.current.style.height = `${ref.current.scrollHeight}px`
		}
	}, [])
	return (
		<textarea
			ref={ ref }
			placeholder={ placeholder }
			className={ clsx('resize-none overflow-hidden', className) }
			value={ value }
			onChange={ e => {
				e.target.style.height = '0px'
				e.target.style.height = `${e.target.scrollHeight}px`
				onChange(e.target.value)
			} }
		/>
	)
}

const fileToUlr = (file: File): string => URL.createObjectURL(file)

const urlToCanvas = (url: string): Promise<HTMLCanvasElement> => new Promise((resolve, reject) => {
	const image = new Image()
	image.onload = () => {
		const scale = Math.min(1, 1280 / image.naturalWidth) * devicePixelRatio
		const canvas = document.createElement('canvas')
		const context = canvas.getContext('2d')!

		canvas.width = Math.floor(image.naturalWidth * scale)
		canvas.height = Math.floor(image.naturalHeight * scale)

		context.imageSmoothingEnabled = true
		context.imageSmoothingQuality = 'high'

		context.scale(devicePixelRatio, devicePixelRatio)

		context.drawImage(image, 0, 0, canvas.width, canvas.height)

		resolve(canvas)

		URL.revokeObjectURL(url)

	}
	image.onerror = () => {
		reject(`Cannot load image: ${url}`)
		URL.revokeObjectURL(url)
	}
	image.src = url
})

const urlToImage = (url: string): Promise<HTMLImageElement> => new Promise((resolve, reject) => {
	const image = new Image()
	image.onload = () => {
		resolve(image)
		URL.revokeObjectURL(url)
	}
	image.onerror = () => {
		reject(`Cannot load image: ${url}`)
		URL.revokeObjectURL(url)
	}
	image.src = url
})

const filesToUrls = (files: File[]) => files.map(fileToUlr)

const filesToImages = (files: File[]) => Promise.all(
	files.map((file): Promise<HTMLImageElement> =>
		urlToImage(
			URL.createObjectURL(file)
		)
	)
)

const filesToCanvases = (files: File[]) => Promise.all(
	files.map((file): Promise<HTMLCanvasElement> =>
		urlToCanvas(
			URL.createObjectURL(file)
		)
	)
)

const urlsToImages = (urls: string[]) => Promise.all(
	urls.map((url): Promise<HTMLImageElement> =>
		urlToImage(url)
	)
)

const urlsToCanvases = (urls: string[]) => Promise.all(
	urls.map((url): Promise<HTMLCanvasElement> =>
		urlToCanvas(url)
	)
)

const urls = [
	'/x/1.png',
	'/x/2.png',
	'/x/3.png',
	'/x/4.png',
	'/x/6.png',
	'/x/7.png',
	'/x/8.png',
	'/x/9.png',
	'/x/10.png',
	'/x/11.png',
	'/x/12.png',
	'/x/5.png',
]

const breakpoint = {
	desktop: {
		icon: <DesktopIcon />,
		breakpoint: 1280,
		className: '7xl'
	},
	tablet: {
		icon: <TabletIcon />,
		breakpoint: 768,
		className: '3xl'
	},
	mobile: {
		icon: <MobileIcon />,
		breakpoint: 384,
		className: 'sm'
	}
}

const breakpoints = Object.entries(breakpoint)

const defaultCols = 285
const defaultSize = defaultCols / 3

const generateDefaultTemplates = (images: HTMLImageElement[]): Templates =>
	breakpoints.reduce((acc, [ key, { className, breakpoint } ]) => {
		const grid = breakpoint / defaultCols
		const items = images.map((img, i) => {
			const width = defaultSize * grid
			const height = defaultSize * grid
			const imgWidth = img.naturalWidth
			const imgHeight = img.naturalHeight
			const scale = Math.min(imgWidth / width, imgHeight / height)
			return {
				z: 0,
				x: ((i % 3) * defaultSize) * grid,
				y: (Math.floor(i / 3) * defaultSize) * grid,
				w: width,
				h: height,
				sx: ((imgWidth - width * scale) * .5) / imgWidth,
				sy: ((imgHeight - height * scale) * .5) / imgHeight,
				sw: (width * scale) / imgWidth,
				sh: (height * scale) / imgHeight,
				bw: 1,
				bh: 1
			}
		})
		const rows = Math.max(
			...items.map(v => (v.y + v.h) / grid)
		)
		return {
			...acc,
			[ key ]: {
				className: className,
				edited: false,
				grid: grid,
				breakpoint: breakpoint,
				layout: {
					cols: defaultCols,
					rows: rows,
					items: items
				}
			}
		}
	}, {})


const MainUpload = ({ uploadImages }: { uploadImages: Function }) =>
	<Droppable className='size-full flex flex-col justify-center items-center' noClick={ true } onDrop={ uploadImages }>
		<section className='flex flex-col justify-center items-center gap-y-5'>
			<Droppable onDrop={ uploadImages } noDragsEventBubbling={ true }>
				<button className='cursor-pointer flex justify-center items-center gap-x-2 p-4'>
					<AccessibleIcon label='Upload images'>
						<UploadIcon className='size-6' />
					</AccessibleIcon>
					<span className='text-3xl font-medium'>Upload images</span>
				</button>
			</Droppable>
			<div className='flex flex-col justify-center items-center gap-y-2'>
				<small className='text-base font-medium text-neutral-500'>Supported: PNG, JPG, WEBP, AVIF, HEIC/HEIF.</small>
				<small className='text-base font-medium text-neutral-500'>Recommended resolution: 1920 x 1080 or lower.</small>
			</div>
		</section>
	</Droppable>


const MainEditor = ({
	template,
	setTemplate,
	error,
	name,
	setName,
	location,
	setLocation,
	story,
	setStory,
	tagline,
	setTagline,
	images,
	uploadImages,
	deleteImages
}: {
	error: string,
	template: Template,
	setTemplate: Function,
	images: HTMLImageElement[],
	uploadImages: Function,
	deleteImages: Function,
	name: string,
	setName: Function,
	location: string,
	setLocation: Function,
	story: string,
	setStory: Function,
	tagline: string
	setTagline: Function
}) =>
	<Droppable className='size-full' noClick={ true } onDrop={ uploadImages }>
		<section className='flex flex-col items-center size-full py-20 gap-y-20'>
			<header className='w-full h-auto max-w-xl flex flex-col justify-center items-center gap-y-10'>
				<div className='flex flex-col gap-y-5 justify-center items-center w-full font-serif'>
					<input className='w-full text-xl text-center focus:outline-1 focus:outline-amber-600' type='text' placeholder='Name' value={ name } onChange={ e => setName(e.target.value) } />
					<input className='w-full text-xs text-center focus:outline-1 focus:outline-amber-600' type='text' placeholder='Location' value={ location } onChange={ e => setLocation(e.target.value) } />
				</div>
				<TextArea className='w-full font-sans text-base font-semibold text-center focus:outline-1 focus:outline-amber-600' placeholder='Story' value={ story } onChange={ setStory } />
				<TextArea className='w-full font-serif text-sm/loose text-center focus:outline-1 focus:outline-amber-600' placeholder='Tagline' value={ tagline } onChange={ setTagline } />
			</header>
			<Editor
				key={ template.breakpoint }
				images={ images }
				deleteImages={ deleteImages }
				template={ template }
				setTemplate={ setTemplate }
			/>
		</section >
	</Droppable>


const SideHeader = ({ menu, setMenu }: { menu: boolean, setMenu: Function }) =>
	<div className='flex size-full justify-between items-center min-h-20 *:h-[40%] *:w-auto'>
		<div className='flex flex-row justify-center items-center rounded-md *:h-full'>
			<button className='rounded-md hover:bg-neutral-200 px-2'>
				<AccessibleIcon label='Preview'>
					<PreviewIcon />
				</AccessibleIcon>
			</button>
			<DropdownMenu.Root>
				<DropdownMenu.Trigger className='rounded-md hover:bg-neutral-200 px-0.5'>
					<AccessibleIcon label='Show action menu'>
						<AngleDownIcon />
					</AccessibleIcon>
				</DropdownMenu.Trigger>
				<DropdownMenu.Portal>
					<DropdownMenu.Content align='end' className='flex flex-col justify-center items-center gap-y-1 font-sans font-semibold text-base z-50 bg-white ring-1 ring-neutral-200 rounded-md p-2'>
						<DropdownMenu.Item>
							<Link className='flex gap-x-2 justify-center items-center rounded-md hover:bg-neutral-200 px-2 py-1' href='/dashboard'>
								<span>
									<AccessibleIcon label='Preview'>
										<PreviewIcon />
									</AccessibleIcon>
								</span>
								<span>Preview</span>
							</Link>
						</DropdownMenu.Item>
						<DropdownMenu.Item>
							<Link className='flex gap-x-2 justify-center items-center rounded-md hover:bg-neutral-200 px-2 py-1' href='/dashboard'>
								<span>
									<AccessibleIcon label='Publish'>
										<ShareIcon />
									</AccessibleIcon>
								</span>
								<span>Publish</span>
							</Link>
						</DropdownMenu.Item>
					</DropdownMenu.Content>
				</DropdownMenu.Portal>
			</DropdownMenu.Root>
		</div>
		<button onClick={ () => setMenu(!menu) } className='flex h-full px-3 justify-center items-center rounded-md hover:bg-neutral-200'>
			<AccessibleIcon label='Toggle menu'>
				<LayoutIcon />
			</AccessibleIcon>
		</button>
	</div>

const ThumbnailInput = ({ thumbnail, setThumbnail }: { thumbnail: HTMLImageElement[], setThumbnail: Function }) => {

	const Empty = (
		<Droppable onDrop={ setThumbnail } className='cursor-pointer text-lg font-medium w-full rounded-md bg-neutral-200 h-52 flex flex-col justify-center items-center text-neutral-500'>
			<span>Thumbnail</span>
		</Droppable>
	)
	const Content = (
		<div>
			{
				thumbnail.map(({ src }) =>
					<img key={ src } src={ src } className='rounded-md object-cover object-center h-52 w-full' />
				)
			}
		</div>
	)

	return thumbnail.length > 0 ? Content : Empty
}

const SideMain = ({
	thumbnail,
	setThumbnail,
	url,
	setUrl,
	title,
	setTitle,
	description,
	setDescription
}: {
	thumbnail: HTMLImageElement[],
	setThumbnail: Function,
	url: string,
	setUrl: Function,
	title: string,
	setTitle: Function,
	description: string,
	setDescription: Function
}) =>
	<form className='flex flex-col justify-center items-stretch h-max w-full gap-y-10'>
		<ThumbnailInput thumbnail={ thumbnail } setThumbnail={ setThumbnail } />
		<div>
			<label className='text-lg font-semibold sr-only'>URL</label>
			<input onChange={ e => setUrl(e.target.value) } value={ url } className='text-lg font-medium w-full px-4 py-2 rounded-md bg-neutral-200 focus:outline-1 focus:outline-amber-600' placeholder='URL' type='url' />
			<small className='text-base font-medium text-neutral-500'>{ `kattinterior.com/${url}` }</small>
		</div>
		<div>
			<label className='text-lg font-semibold sr-only'>Title</label>
			<input onChange={ e => setTitle(e.target.value) } value={ title } className='text-lg font-medium w-full px-4 py-2 rounded-md bg-neutral-200 focus:outline-1 focus:outline-amber-600' placeholder='Title' type='text' />
			<small className='text-base font-medium text-neutral-500'>{ `Recommended: 60 characters. You’ve used ${title.length}` }</small>
		</div>
		<div>
			<label className='text-lg font-semibold sr-only'>Description</label>
			<textarea onChange={ e => setDescription(e.target.value) } value={ description } className='text-lg font-medium w-full px-4 py-2 rounded-md bg-neutral-200 focus:outline-1 focus:outline-amber-600 min-h-30' placeholder='Description'></textarea>
			<small className='text-base font-medium text-neutral-500'>{ `Recommended: 145 characters. You’ve used ${description.length}` }</small>
		</div>
	</form>


const SideFooter = () =>
	<div>
		<Link className='flex gap-x-2 justify-center items-center h-9 p-3 rounded-md hover:bg-neutral-100' href='/dashboard'>
			<span><DeleteIcon /></span>
			<span className='text-lg font-semibold'>Delete</span>
		</Link>
	</div>


const Breakpoint = ({ className, breakpoint, setBreakpoint }: { className: string, breakpoint: string, setBreakpoint: Function }) => (
	<ul className={ clsx(className, 'bg-white grid grid-cols-3 place-items-center gap-x-5 outline-1 p-1 outline-neutral-200 rounded-md') }>
		{
			breakpoints.map(([ key, value ]) =>
				<li className='size-full' key={ key }>
					<Tooltip.Provider>
						<Tooltip.Root>
							<Tooltip.Trigger asChild>
								<button
									className={
										clsx(
											'flex items-center justify-center rounded-sm cursor-pointer hover:bg-neutral-200 size-full px-2',
											{ 'bg-neutral-200': breakpoint === key }
										)
									}
									onClick={ () => setBreakpoint(key) }
								>
									<AccessibleIcon label={ key }>
										{ value.icon }
									</AccessibleIcon>
								</button>
							</Tooltip.Trigger>
							<Tooltip.Portal>
								<Tooltip.Content side='bottom' sideOffset={ 10 } className='px-2 py-1 capitalize font-sans font-semibold text-sm text-center rounded-sm bg-white outline-1 outline-neutral-200'>
									{ key + ' view' }
								</Tooltip.Content>
							</Tooltip.Portal>
						</Tooltip.Root>
					</Tooltip.Provider>
				</li>
			)
		}
	</ul>
)

const MainHeader = ({ content, menu, setMenu, breakpoint, setBreakpoint }: { content: boolean, menu: boolean, setMenu: Function, breakpoint: string, setBreakpoint: Function }) => (
	<header className='sticky top-0 left-0 right-0 size-full px-5 grid grid-cols-3 items-center z-50 min-h-20 *:h-[40%] *:w-auto pointer-events-none'>
		<Link className='justify-self-start flex justify-center items-center hover:bg-neutral-200 rounded-md text-center px-2 pointer-events-auto' href='/dashboard/posts'>
			<span><AngleLeftIcon /></span>
			<span className='text-base font-semibold'>Back</span>
		</Link>
		{
			content
				? (
					<>
						<Breakpoint className='justify-self-center pointer-events-auto' breakpoint={ breakpoint } setBreakpoint={ setBreakpoint } />
						<button onClick={ e => { e.stopPropagation(); setMenu(!menu) } } className='pointer-events-auto px-3 justify-self-end cursor-pointer flex gap-x-2 justify-center items-center hover:bg-neutral-200 rounded-md' >
							<AccessibleIcon label='Toggle settings'>
								<LayoutIcon />
							</AccessibleIcon>
						</button>
					</>
				)
				: null
		}
	</header>
)

export default () => {
	const [ menu, setMenu ] = useState(false)
	const [ files, setFiles ] = useState<File[]>([])
	const [ error, setError ] = useState('')
	const [ images, setImages ] = useState<HTMLImageElement[]>([])
	const [ templates, setTemplates ] = useState<Templates>({})
	const [ name, setName ] = useState('')
	const [ location, setLocation ] = useState('')
	const [ story, setStory ] = useState('')
	const [ tagline, setTagline ] = useState('')
	const [ thumbnailImage, setThumbnailImage ] = useState<HTMLImageElement[]>([])
	const [ thumbnailFile, setThumbnailFile ] = useState<File[]>([])
	const [ url, setUrl ] = useState('')
	const [ title, setTitle ] = useState('')
	const [ description, setDescription ] = useState('')
	const [ breakpoint, setBreakpoint ] = useState('desktop')

	const uploadImages = (files: File[]) => {
		window.scrollTo({
			behavior: 'smooth',
			top: 0,
			left: 0
		})
		setFiles((prev: File[]) =>
			prev.concat(files)
		)
		filesToImages(files).then(
			images => {
				setImages((prev: HTMLImageElement[]) =>
					prev.concat(images)
				)
				setTemplates((templates: Templates) => {
					const entries = Object.entries(templates)
					if(entries.length === 0) {
						return generateDefaultTemplates(images)
					} else {
						return entries.reduce((acc, [ key, template ]) => {
							const grid = template.breakpoint / template.layout.cols
							const items = template.layout.items.concat(
								images.map((img, i) => {
									const width = defaultSize * grid
									const height = defaultSize * grid
									const imgWidth = img.naturalWidth
									const imgHeight = img.naturalHeight
									const scale = Math.min(imgWidth / width, imgHeight / height)
									return {
										z: 0,
										x: ((i % 3) * defaultSize) * grid,
										y: (Math.floor(i / 3) * defaultSize) * grid,
										w: width,
										h: height,
										sx: ((imgWidth - width * scale) * .5) / imgWidth,
										sy: ((imgHeight - height * scale) * .5) / imgHeight,
										sw: (width * scale) / imgWidth,
										sh: (height * scale) / imgHeight,
										bw: 1,
										bh: 1
									}
								})
							)
							const rows = Math.round(
								Math.max(
									...items.map(v => (v.y + v.h) / grid)
								)
							)
							return {
								...acc,
								[ key ]: {
									...template,
									layout: { ...template.layout, items, rows }
								}
							}
						}, {})
					}
				})
			},
			setError
		)
	}

	const deleteImages = (indexes: number[]) => {
		setFiles((files: File[]) =>
			files.filter((_, i) =>
				!indexes.includes(i)
			)
		)
		setImages((images: HTMLImageElement[]) =>
			images.filter((_, i) =>
				!indexes.includes(i)
			)
		)
		setTemplates((templates: Templates) =>
			Object.entries(templates).reduce((acc, [ key, template ]) => {
				const items = template.layout.items.filter((_, i) =>
					!indexes.includes(i)
				)
				const rows = Math.round(
					Math.max(
						...items.map(v => (v.y + v.h) / template.grid)
					)
				)
				return {
					...acc,
					[ key ]: {
						...template,
						layout: { ...template.layout, items, rows }
					}
				}
			}, {})
		)
	}

	const uploadThumbnail = (files: File[]) => {
		setThumbnailFile(files)
		filesToImages(files).then(setThumbnailImage, setError)
	}

	useEffect(() => {
		urlsToImages(urls).then(
			images => {
				setTemplates(
					generateDefaultTemplates(images)
				)
				setImages(images)
			},
			setError
		)

	}, [])

	const setTemplate = (breakpoint: string) =>
		(fn: (template: Template) => Template) =>
			setTemplates((templates: Templates) => {
				const current = { ...fn(templates[ breakpoint ]), edited: true }
				return Object.entries(templates)
					.filter(([ key ]) => key !== breakpoint)
					.reduce((acc, [ key, value ]) => {
						if(value.edited) {
							return { ...acc, [ key ]: value }
						} else {
							const items = current.layout.items.map(item => {
								const box = {
									x: Math.round(item.x / current.grid) * value.grid,
									y: Math.round(item.y / current.grid) * value.grid,
									w: Math.round(item.w / current.grid) * value.grid,
									h: Math.round(item.h / current.grid) * value.grid,
								}
								return { ...item, ...box }
							})
							const rows = Math.round(
								Math.max(
									...items.map(v => (v.y + v.h) / value.grid)
								)
							)
							return {
								...acc,
								[ key ]: {
									...value,
									layout: { ...value.layout, items, rows }
								}
							}
						}
					}, { [ breakpoint ]: current })
			})



	return (
		<>
			<section onClick={ () => setMenu(false) } className='min-h-[100dvh] size-full grid grid-rows-[auto_1fr] place-items-center'>
				<MainHeader
					content={ images.length > 0 }
					menu={ menu }
					setMenu={ setMenu }
					breakpoint={ breakpoint }
					setBreakpoint={ setBreakpoint }
				/>
				{
					images.length > 0
						? <MainEditor
							template={ templates[ breakpoint ] }
							setTemplate={ setTemplate(breakpoint) }
							name={ name }
							setName={ setName }
							location={ location }
							setLocation={ setLocation }
							story={ story }
							setStory={ setStory }
							tagline={ tagline }
							setTagline={ setTagline }
							images={ images }
							uploadImages={ uploadImages }
							deleteImages={ deleteImages }
							error={ error }
						/>
						: <MainUpload uploadImages={ uploadImages } />
				}
			</section>
			{
				menu
					? (
						<section className='z-50 fixed right-0 top-0 bottom-0 px-5 w-sm grid grid-rows-[auto_max-content_1fr] gap-y-10 place-items-center outline-1 outline-neutral-200 bg-light'>
							<SideHeader menu={ menu } setMenu={ setMenu } />
							<SideMain
								thumbnail={ thumbnailImage }
								setThumbnail={ uploadThumbnail }
								url={ url }
								setUrl={ setUrl }
								title={ title }
								setTitle={ setTitle }
								description={ description }
								setDescription={ setDescription }
							/>
							<SideFooter />
						</section>
					)
					: null
			}
		</>
	)
}