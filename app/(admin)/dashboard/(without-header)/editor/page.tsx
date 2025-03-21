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
import * as Tooltip from '@radix-ui/react-tooltip'

import { Item, Layout, Template, Templates } from '@/type/editor'
import Editor from '@/components/Editor';

import DesktopIcon from '@/public/desktop.svg'
import TabletIcon from '@/public/tablet.svg'
import MobileIcon from '@/public/mobile.svg'

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

const Editable = ({ children, className = '' }: Readonly<{ children: React.ReactNode, className?: string }>) => {
	return (
		<div className={ className }>
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

const breakpoints: [ string, ReactElement, string, number ][] = [
	[ 'Desktop', <DesktopIcon />, '7xl', 1280 ],
	[ 'Tablet', <TabletIcon />, '3xl', 768 ],
	[ 'Mobile', <MobileIcon />, 'sm', 384 ]
]

const defaultCols = 63
const defaultSize = defaultCols / 3
const generateDefaultTemplates = (assets: any[]): Templates =>
	breakpoints.map(([ name, icon, className, breakpoint ], i) => {
		const items = assets.map((_, j) => {
			return {
				i: j,
				x: (j % 3) * defaultSize,
				y: Math.floor(j / 3) * defaultSize,
				w: defaultSize,
				h: defaultSize,
				sx: .5,
				sy: .5
			}
		})
		const rows = Math.max(
			...items.map(v => v.y + v.h)
		)
		return {
			index: i,
			className: className,
			edited: false,
			breakpoint: breakpoint,
			layout: {
				cols: defaultCols,
				rows: rows,
				items: items
			}
		}
	})

const Main = ({
	template,
	setTemplate,
	files,
	setFiles,
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
	setImages
}: {
	error: string,
	files: File[],
	setFiles: Function,
	template: Template,
	setTemplate: Function,
	images: string[],
	setImages: Function,
	name: string,
	setName: Function,
	location: string,
	setLocation: Function,
	story: string,
	setStory: Function,
	tagline: string
	setTagline: Function
}) => {

	return images.length > 0
		? (
			<section className='flex flex-col gap-y-30 justify-center items-center size-full'>
				<header className='w-full h-auto max-w-xl flex flex-col justify-center items-center gap-y-10'>
					<div className='flex flex-col gap-y-5 justify-center items-center w-full font-serif'>
						<input className='w-full text-xl text-center' type='text' placeholder='Name' value={ name } onChange={ e => setName(e.target.value) } />
						<input className='w-full text-xs text-center' type='text' placeholder='Location' value={ location } onChange={ e => setLocation(e.target.value) } />
					</div>
					<TextArea className='w-full font-sans text-base font-semibold text-center' placeholder='Story' value={ story } onChange={ setStory } />
					<TextArea className='w-full font-serif text-sm/loose text-center' placeholder='Tagline' value={ tagline } onChange={ setTagline } />
				</header>
				<Editor
					images={ images }
					template={ template }
					setTemplate={ setTemplate }
				/>
			</section >
		)
		: <Droppable className='size-full flex flex-col justify-center items-center' noClick={ true } onDrop={ setImages }>
			<section className='flex flex-col justify-center items-center gap-y-5'>
				<Droppable onDrop={ setImages } noDragsEventBubbling={ true }>
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
}

const SideHeader = ({ menu, setMenu }: { menu: boolean, setMenu: Function }) => (
	<div className='flex size-full justify-between items-center'>
		<div className='flex flex-row justify-center items-center rounded-md hover:bg-neutral-100'>
			<button className='h-9 py-3 px-2 rounded-md hover:bg-neutral-200'>
				<AccessibleIcon label='Preview'>
					<PreviewIcon />
				</AccessibleIcon>
			</button>
			<DropdownMenu.Root>
				<DropdownMenu.Trigger className='h-9 py-3 px-2 rounded-md hover:bg-neutral-200'>
					<AccessibleIcon label='Show action menu'>
						<AngleDownIcon />
					</AccessibleIcon>
				</DropdownMenu.Trigger>
				<DropdownMenu.Portal>
					<DropdownMenu.Content align='end' className='z-20 bg-white ring-1 ring-neutral-200 rounded-md p-2'>
						<DropdownMenu.Item>
							<Link className='flex gap-x-2 justify-center items-center h-9 p-3 rounded-md hover:bg-neutral-100 text-base font-semibold' href='/dashboard'>
								<span>
									<AccessibleIcon label='Preview'>
										<PreviewIcon />
									</AccessibleIcon>
								</span>
								<span>Preview</span>
							</Link>
						</DropdownMenu.Item>
						<DropdownMenu.Item>
							<Link className='flex gap-x-2 justify-center items-center h-9 p-3 rounded-md hover:bg-neutral-100 text-base font-semibold' href='/dashboard'>
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
		<button onClick={ () => setMenu(!menu) } className='flex justify-center items-center h-9 p-3 rounded-md hover:bg-neutral-100'>
			<AccessibleIcon label='Toggle menu'>
				<LayoutIcon />
			</AccessibleIcon>
		</button>
	</div>
)

const ThumbnailInput = ({ thumbnail, setThumbnail }: { thumbnail: string[], setThumbnail: Function }) => {

	const Empty = (
		<Droppable onDrop={ setThumbnail } className='cursor-pointer text-lg font-medium w-full rounded-md bg-neutral-100 h-52 flex flex-col justify-center items-center text-neutral-500'>
			<span>Thumbnail</span>
		</Droppable>
	)
	const Content = (
		<div>
			{
				thumbnail.map(src =>
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
	thumbnail: string[],
	setThumbnail: Function,
	url: string,
	setUrl: Function,
	title: string,
	setTitle: Function,
	description: string,
	setDescription: Function
}) => (
	<form className='flex flex-col justify-center items-stretch h-max w-full gap-y-10'>
		<ThumbnailInput thumbnail={ thumbnail } setThumbnail={ setThumbnail } />
		<div>
			<label className='text-lg font-semibold sr-only'>URL</label>
			<input onChange={ e => setUrl(e.target.value) } value={ url } className='text-lg font-medium w-full px-4 py-2 rounded-md bg-neutral-100' placeholder='URL' type='url' />
			<small className='text-base font-medium text-neutral-500'>{ `kattinterior.com/${url}` }</small>
		</div>
		<div>
			<label className='text-lg font-semibold sr-only'>Title</label>
			<input onChange={ e => setTitle(e.target.value) } value={ title } className='text-lg font-medium w-full px-4 py-2 rounded-md bg-neutral-100' placeholder='Title' type='text' />
			<small className='text-base font-medium text-neutral-500'>{ `Recommended: 60 characters. You’ve used ${title.length}` }</small>
		</div>
		<div>
			<label className='text-lg font-semibold sr-only'>Description</label>
			<textarea onChange={ e => setDescription(e.target.value) } value={ description } className='text-lg font-medium w-full px-4 py-2 rounded-md bg-neutral-100 min-h-30' placeholder='Description'></textarea>
			<small className='text-base font-medium text-neutral-500'>{ `Recommended: 145 characters. You’ve used ${description.length}` }</small>
		</div>
	</form>
)

const SideFooter = () => (
	<div>
		<Link className='flex gap-x-2 justify-center items-center h-9 p-3 rounded-md hover:bg-neutral-100' href='/dashboard'>
			<span><DeleteIcon /></span>
			<span className='text-lg font-semibold'>Delete</span>
		</Link>
	</div>
)

const Breakpoint = ({ className, templateIndex, setTemplateIndex }: { className: string, templateIndex: number, setTemplateIndex: Function }) => (
	<ul className={ clsx(className, 'bg-white flex flex-row items-center justify-center gap-x-5 outline-1 outline-neutral-200 p-1 rounded-md') }>
		{
			breakpoints.map(([ breakpoint, icon ], i) =>
				<li key={ breakpoint }>
					<Tooltip.Provider>
						<Tooltip.Root>
							<Tooltip.Trigger asChild>
								<button
									className={
										clsx(
											'flex items-center justify-center rounded-sm p-2 cursor-pointer hover:bg-neutral-100',
											{ 'bg-neutral-200': templateIndex === i }
										)
									}
									onClick={ () => setTemplateIndex(i) }
								>
									<AccessibleIcon label={ breakpoint }>
										{ icon }
									</AccessibleIcon>
								</button>
							</Tooltip.Trigger>
							<Tooltip.Portal>
								<Tooltip.Content side='bottom' sideOffset={ 10 } className='font-sans font-medium text-neutral-500 text-base text-center rounded-sm outline-1 outline-neutral-100 px-2 py-1'>
									{ breakpoint + ' view' }
								</Tooltip.Content>
							</Tooltip.Portal>
						</Tooltip.Root>
					</Tooltip.Provider>
				</li>
			)
		}
	</ul>
)

const MainHeader = ({ menu, setMenu, templateIndex, setTemplateIndex }: { menu: boolean, setMenu: Function, templateIndex: number, setTemplateIndex: Function }) => (
	<header className='sticky top-0 left-0 right-0 size-full grid grid-cols-3 items-center z-10'>
		<Link className='justify-self-start h-9 flex gap-x-2 justify-center items-center hover:bg-neutral-100 p-3 rounded-md' href='/dashboard/posts'>
			<span><AngleLeftIcon /></span>
			<span className='text-lg font-semibold'>Back</span>
		</Link>
		<Breakpoint className='justify-self-center' templateIndex={ templateIndex } setTemplateIndex={ setTemplateIndex } />
		<button onClick={ () => setMenu(!menu) } className='justify-self-end h-9 p-3 cursor-pointer flex gap-x-2 justify-center items-center hover:bg-neutral-100 rounded-md' >
			<AccessibleIcon label='Toggle settings'>
				<LayoutIcon />
			</AccessibleIcon>
		</button>
	</header>
)


export default () => {
	const [ menu, setMenu ] = useState(false)
	const [ files, setFiles ] = useState<File[]>([])
	const [ error, setError ] = useState('')
	const [ images, setImages ] = useState<string[]>([])
	const [ templates, setTemplates ] = useState<Templates>([])
	const [ name, setName ] = useState('')
	const [ location, setLocation ] = useState('')
	const [ story, setStory ] = useState('')
	const [ tagline, setTagline ] = useState('')
	const [ thumbnailImage, setThumbnailImage ] = useState<string[]>([])
	const [ thumbnailFile, setThumbnailFile ] = useState<File[]>([])
	const [ url, setUrl ] = useState('')
	const [ title, setTitle ] = useState('')
	const [ description, setDescription ] = useState('')
	const [ templateIndex, setTemplateIndex ] = useState(0)

	const uploadImages = (files: File[]) => {
		setFiles(files)
		setImages(
			filesToUrls(files)
		)
		setTemplates(
			generateDefaultTemplates(files)
		)
	}

	const uploadThumbnail = (files: File[]) => {
		setThumbnailFile(files)
		setThumbnailImage(
			filesToUrls(files)
		)
	}

	useEffect(() => {
		setImages(urls)
		setTemplates(
			generateDefaultTemplates(urls)
		)
	}, [])

	const setTemplate = (index: number) => (fn: (template: Template) => Template) => setTemplates(templates =>
		templates.with(
			index,
			fn(templates[ index ])
		)
	)

	return (
		<>
			<section className='p-6 min-h-[100dvh] grid grid-rows-[50px_1fr] place-items-center size-full gap-y-16'>
				<MainHeader
					menu={ menu }
					setMenu={ setMenu }
					templateIndex={ templateIndex }
					setTemplateIndex={ setTemplateIndex }
				/>
				{
					templates.length > 0
						? (
							<Main
								template={ templates[ templateIndex ] }
								setTemplate={ setTemplate(templateIndex) }
								name={ name }
								setName={ setName }
								location={ location }
								setLocation={ setLocation }
								story={ story }
								setStory={ setStory }
								tagline={ tagline }
								setTagline={ setTagline }
								files={ files }
								setFiles={ setFiles }
								images={ images }
								setImages={ uploadImages }
								error={ error }

							/>
						)
						: null
				}
			</section>
			{
				images.length > 0 && menu
					? (
						<section className='p-6 z-10 fixed right-0 top-0 w-sm h-[100dvh] grid grid-rows-[50px_max-content_1fr] gap-y-10 place-items-center border-l border-l-neutral-200 bg-white'>
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