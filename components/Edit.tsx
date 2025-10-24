/* eslint-disable @typescript-eslint/no-unused-vars */

'use client'

import { MoveIcon, ResetIcon, CrossCircledIcon, CheckCircledIcon, TrashIcon, Share2Icon, PlayIcon, UploadIcon, CaretDownIcon, DesktopIcon, MobileIcon, BoxIcon, ViewVerticalIcon, InfoCircledIcon, ImageIcon, ChevronLeftIcon, GearIcon } from '@radix-ui/react-icons'
import { AlertDialog, Toast, DropdownMenu, Tooltip, AccessibleIcon, Switch, RadioGroup } from 'radix-ui'
import React, { MouseEvent, useEffect, useLayoutEffect, useRef, useState } from 'react';
import clsx from 'clsx';

import { Photo, Project, Template, Layout, Photos, Device, Asset, Items } from '@/type/editor'
import Editor from '@/components/Editor';
import { deleteProject, updateProject, deleteFiles, uploadFiles } from '@/action/client';
import { useRouter } from 'next/navigation';
import downscale from 'downscale';

import { v7 as UUIDv7 } from 'uuid'
import Droppable from './Droppable';
import { useDrag, UseDragListener } from '@/hook/useDrag';
import { applyBoxConstrain, between, clamp, curry, toStorageURL, alt as alternative } from '@/utility/fn';
import { rebuildPath } from '@/action/server';

const fileToUrl = (file: File | Blob): string => URL.createObjectURL(file)

const development = process.env.NODE_ENV === 'development'
const domain = development ? 'localhost:3000' : process.env.NEXT_PUBLIC_DOMAIN
const siteName = process.env.NEXT_PUBLIC_SITE_NAME

const urlToPhoto = (url: string): Promise<Photo> => new Promise((resolve, reject) => {
	const image = new Image()
	image.onload = () => {
		resolve({
			id: UUIDv7(),
			src: url,
			alt: '',
			width: image.naturalWidth,
			height: image.naturalHeight,
			thumbnail: false
		})
	}
	image.onerror = () => {
		reject(`Cannot load image: ${url}`)
		URL.revokeObjectURL(url)
	}
	image.src = url
})

const filesToPhotos = (files: File[] | Blob[]) => Promise.all(
	files.map((file): Promise<Photo> =>
		urlToPhoto(
			fileToUrl(file)
		)
	)
)

const compressFromFiles = (files: File[]): Promise<Blob[]> =>
	filesToPhotos(files).then(images =>
		Promise.all(
			images.map((v, i) =>
				downscale(files[i], Math.min(v.width, 1920), 0, { returnBlob: true })
			)
		)
	)

const TextArea = ({ required = false, placeholder, className, value, onChange }: { required?: boolean, placeholder?: string, className?: string, value?: string, onChange: (change: string) => void }) => {
	const ref = useRef<HTMLTextAreaElement>(null)

	useLayoutEffect(() => {
		ref.current!.style.height = '0px'
		ref.current!.style.height = `${ref.current!.scrollHeight}px`
	}, [])

	return (
		<textarea
			ref={ref}
			placeholder={placeholder}
			required={required}
			className={clsx('resize-none overflow-hidden', className)}
			value={value}
			onChange={e => {
				e.target.style.height = '0px'
				e.target.style.height = `${e.target.scrollHeight}px`
				onChange(e.target.value)
			}}
		/>
	)
}

const breakpoint = {
	desktop: {
		icon: <DesktopIcon />,
		breakpoint: 1280
	},
	tablet: {
		icon: <BoxIcon />,
		breakpoint: 768,
	},
	mobile: {
		icon: <MobileIcon />,
		breakpoint: 384,
	}
}

const breakpoints = Object.keys(breakpoint)

const MainUpload = ({ uploadAssets }: { uploadAssets: (files: File[]) => Promise<void> }) =>
	<Droppable className='size-full flex flex-col justify-center items-center' noClick={true} onDrop={uploadAssets}>
		<section className='flex flex-col justify-center items-center gap-y-5 px-10'>
			<Droppable onDrop={uploadAssets} noDragsEventBubbling={true}>
				<button className='cursor-pointer flex justify-center items-center gap-x-2 p-4'>
					<AccessibleIcon.Root label='Upload images'>
						<UploadIcon className='text-neutral-500' />
					</AccessibleIcon.Root>
					<p className='text-3xl font-medium'>Upload images</p>
				</button>
			</Droppable>
			<div className='flex flex-col justify-center items-center gap-y-2'>
				<small className='text-base font-medium text-neutral-500'>Supported: PNG, JPG, WEBP, AVIF.</small>
				<small className='text-base font-medium text-neutral-500'>Maximum resolution: 4000 x 4000.</small>
			</div>
		</section>
	</Droppable>

const MainEditorHeader = ({ errors, name, location, story, tagline, setName, setLocation, setStory, setTagline }: {
	errors: string[],
	name: string,
	location: string,
	story: string,
	tagline: string,
	setName: (value: string) => void,
	setLocation: (value: string) => void,
	setStory: (value: string) => void,
	setTagline: (value: string) => void
}) => (
	<header className='w-full h-auto max-w-3xl flex flex-col justify-center items-center gap-y-10 *:w-full'>
		<div className='flex flex-col justify-center items-center font-serif'>
			<input
				required={true}
				className={clsx('text-2xl py-2 px-4 text-center focus:outline-1 focus:outline-amber-600', { 'outline-1 outline-red-500': errors.includes('name') })}
				type='text'
				placeholder='Name'
				value={name}
				onChange={e => setName(e.target.value)}
			/>
			<input
				required={true}
				className={clsx('text-sm py-2 px-4 text-center focus:outline-1 focus:outline-amber-600', { 'outline-1 outline-red-500': errors.includes('location') })}
				type='text'
				placeholder='Location'
				value={location}
				onChange={e => setLocation(e.target.value)}
			/>
		</div>
		<TextArea
			required={true}
			className={clsx('py-2 px-4 max-w-lg font-sans text-lg font-semibold text-center focus:outline-1 focus:outline-amber-600', { 'outline-1 outline-red-500': errors.includes('story') })}
			placeholder='Story'
			value={story}
			onChange={setStory}
		/>
		<TextArea
			required={true}
			className={clsx('py-2 px-4 font-serif text-lg leading-9 text-center focus:outline-1 focus:outline-amber-600', { 'outline-1 outline-red-500': errors.includes('tagline') })}
			placeholder='Tagline'
			value={tagline}
			onChange={setTagline}
		/>
	</header>
)

const MainEditorBody = ({
	layout,
	setLayout,
	asset,
	setAsset
}: {
	layout: Layout,
	setLayout: (fn: (layout: Layout) => Layout) => void,
	asset: Asset,
	setAsset: (fn: (asset: Asset) => Asset) => void
}) =>
	layout.items.length > 0
		? <Editor
			key={layout.width}
			asset={asset}
			setAsset={setAsset}
			layout={layout}
			setLayout={setLayout}
		/>
		: <section className='size-full flex flex-col justify-center items-center'>
			<div style={{ width: layout.width + 'px', height: '100%' }} className='size-full min-h-100 outline-1 outline-neutral-200 flex flex-col items-center justify-center gap-y-5 px-10'>
				<div className='flex justify-center items-center gap-x-2'>
					<AccessibleIcon.Root label='Drop here'>
						<MoveIcon className='text-neutral-500' />
					</AccessibleIcon.Root>
					<p className='text-3xl font-medium'>Drop here</p>
				</div>
				<small className='text-neutral-500 text-base font-medium'>Drag and drop images from the sidebar here to start editing.</small>
			</div>
		</section>

const RightHeader = ({ onPreview, published, onUnpublish, onPublish, menu, setMenu }: { onPreview: () => void, published: boolean, onUnpublish: () => void, onPublish: () => void, menu: boolean, setMenu: (value: boolean) => void }) =>
	<div className='flex size-full justify-between items-center min-h-20 *:w-auto'>
		<div className='flex flex-row justify-center items-center rounded-md *:h-full'>
			<button onClick={() => onPreview()} className='rounded-md hover:bg-neutral-200 p-2'>
				<AccessibleIcon.Root label='Preview'>
					<PlayIcon />
				</AccessibleIcon.Root>
			</button>
			<DropdownMenu.Root>
				<DropdownMenu.Trigger className='rounded-md hover:bg-neutral-200 px-0.5 py-2'>
					<AccessibleIcon.Root label='Show action menu'>
						<CaretDownIcon />
					</AccessibleIcon.Root>
				</DropdownMenu.Trigger>
				<DropdownMenu.Portal>
					<DropdownMenu.Content
						align='end'
						className='
							flex 
							flex-col 
							items-center 
							justify-center 
							gap-y-0.5
							font-sans 
							font-semibold 
							text-sm 
							z-50 
							bg-light 
							ring-1
							ring-neutral-200 
							rounded-md 
							p-1
						'
					>
						<DropdownMenu.Item
							className='flex gap-x-1 w-full items-center rounded-md px-4 py-1.5 cursor-pointer hover:bg-neutral-200'
							onSelect={() => onPreview()}
						>
							<span>
								<AccessibleIcon.Root label='Preview'>
									<PlayIcon />
								</AccessibleIcon.Root>
							</span>
							<span>Preview</span>
						</DropdownMenu.Item>
						<DropdownMenu.Separator className='h-[1px] my-0.5 bg-neutral-200 w-full' />
						{
							published
								? <DropdownMenu.Item
									className='flex gap-x-1 w-full items-center rounded-md px-4 py-1.5 cursor-pointer hover:bg-neutral-200'
									onSelect={() => onUnpublish()}
								>
									<span>
										<AccessibleIcon.Root label='Unpublish'>
											<ResetIcon />
										</AccessibleIcon.Root>
									</span>
									<span>Unpublish</span>
								</DropdownMenu.Item>
								: null
						}
						<DropdownMenu.Item
							className='flex gap-x-1 w-full items-center rounded-md px-4 py-1.5 cursor-pointer hover:bg-neutral-200'
							onSelect={() => onPublish()}
						>
							<span>
								<AccessibleIcon.Root label='Publish'>
									<Share2Icon />
								</AccessibleIcon.Root>
							</span>
							<span>{published ? 'Update' : 'Publish'}</span>
						</DropdownMenu.Item>
					</DropdownMenu.Content>
				</DropdownMenu.Portal>
			</DropdownMenu.Root>
		</div>
		<button onClick={() => setMenu(!menu)} className='flex p-2 justify-center items-center rounded-md hover:bg-neutral-200'>
			<AccessibleIcon.Root label='Toggle menu'>
				<ViewVerticalIcon />
			</AccessibleIcon.Root>
		</button>
	</div>

const RightMain = ({
	errors,
	category,
	setCategory,
	slug,
	setSlug,
	title,
	setTitle,
	description,
	setDescription,
	featured,
	setFeatured
}: {
	errors: string[],
	category: string,
	setCategory: (category: Project['category']) => void,
	slug: string,
	setSlug: (slug: string) => void,
	title: string,
	setTitle: (title: string) => void,
	description: string,
	setDescription: (description: string) => void,
	featured: boolean,
	setFeatured: (featured: boolean) => void
}) =>
	<div className='flex flex-col justify-center items-stretch h-max w-full gap-y-10'>
		<div className='flex items-center gap-x-4'>
			<small className='text-base font-semibold text-neutral-500'>Category:</small>
			<RadioGroup.Root value={category} onValueChange={v => setCategory(v as Project['category'])} className='flex gap-x-4'>
				{
					['Residential', 'Commercial'].map(v =>
						<div key={v} className='flex gap-x-2 items-center justify-center'>
							<RadioGroup.Item value={v.toLowerCase()} id={v.toLowerCase()} className='size-4 rounded-full flex items-center justify-center outline-1 outline-neutral-400'>
								<RadioGroup.Indicator className='rounded-full size-2 bg-neutral-600' />
							</RadioGroup.Item>
							<label className='text-base font-medium' htmlFor={v.toLowerCase()}>{v}</label>
						</div>
					)
				}
			</RadioGroup.Root>
		</div>
		<div>
			<label htmlFor='slug' className='text-base font-medium sr-only'>Slug</label>
			<input
				id='slug'
				required={true}
				onChange={e => setSlug(e.target.value)}
				onBlur={e => setSlug(e.target.value.toLowerCase().trim().split(' ').join('-'))}
				value={slug}
				className={clsx('text-lg font-medium w-full px-3 py-1.5 rounded-xl bg-neutral-200 focus:outline-1 focus:outline-amber-600', { 'outline-1 outline-red-500': errors.includes('slug') })}
				placeholder='Slug'
				type='url'
			/>
			<small className='text-base font-medium text-neutral-500'>{`${domain}/projects/${slug}`}</small>
		</div>
		<div>
			<label htmlFor='title' className='text-base font-medium sr-only'>Title</label>
			<input
				id='title'
				required={true}
				onChange={e => setTitle(e.target.value)}
				value={title}
				className={clsx('text-lg font-medium w-full px-3 py-1.5 rounded-xl bg-neutral-200 focus:outline-1 focus:outline-amber-600', { 'outline-1 outline-red-500': errors.includes('title') })}
				placeholder='Title'
				type='text'
			/>
			<small className='text-base font-medium text-neutral-500'>{`Recommended: 60 characters. You’ve used ${title.length}`}</small>
		</div>
		<div>
			<label htmlFor='description' className='text-base font-medium sr-only'>Description</label>
			<textarea
				id='description'
				required={true}
				onChange={e => setDescription(e.target.value)}
				value={description}
				className={clsx('text-lg font-medium w-full px-3 py-1.5 rounded-xl bg-neutral-200 focus:outline-1 focus:outline-amber-600 min-h-30', { 'outline-1 outline-red-500': errors.includes('title') })}
				placeholder='Description'
			/>
			<small className='text-base font-medium text-neutral-500'>{`Recommended: 145 characters. You’ve used ${description.length}`}</small>
		</div>
		<div className='flex items-center gap-x-2 rounded-full'>
			<Switch.Root
				id='featured'
				className={clsx('w-8 h-4 rounded-full outline-transparent', featured ? 'bg-neutral-600' : 'bg-neutral-200')}
				onCheckedChange={v => setFeatured(v)}
				checked={featured}
			>
				<Switch.Thumb
					className={clsx(
						'block size-4 rounded-full bg-white shadow-md ring-1 ring-neutral-200 transition-[translate] will-change-transform ease-in-out duration-200',
						featured ? 'translate-x-4' : 'translate-x-0'
					)}
				/>
			</Switch.Root>
			<label className='text-base font-semibold' htmlFor='featured'>Feature in Homepage</label>
		</div>
	</div>


const RightFooter = ({ onDelete }: { onDelete: () => void }) =>
	<button onClick={() => onDelete()} className='flex gap-x-1 justify-center items-center p-2 rounded-lg hover:bg-neutral-200 cursor-pointer'>
		<span><TrashIcon className='text-neutral-500' /></span>
		<span className='font-semibold text-base leading-none'>Delete</span>
	</button>

const WithTooltip = ({ children, tooltip, side }: { children: React.ReactNode, tooltip: string, side: 'top' | 'right' | 'bottom' | 'left' }) => (
	<Tooltip.Provider>
		<Tooltip.Root>
			<Tooltip.Trigger asChild>
				{children}
			</Tooltip.Trigger>
			<Tooltip.Portal>
				<Tooltip.Content side={side} sideOffset={10} className='px-2 py-1 capitalize font-sans font-semibold text-sm text-center rounded-sm bg-light outline-1 outline-neutral-200 z-50'>
					{tooltip}
				</Tooltip.Content>
			</Tooltip.Portal>
		</Tooltip.Root>
	</Tooltip.Provider>
)

const Breakpoint = ({
	className,
	breakpoint,
	setBreakpoint
}: {
	className: string,
	breakpoint: string,
	setBreakpoint: (breakpoint: Device) => void
}) => {
	const Item = ({
		label,
		active,
		onClick,
		icon,
	}: {
		label: string,
		active: boolean,
		onClick: () => void,
		icon: React.JSX.Element
	}) =>
		<WithTooltip side='bottom' tooltip={label + ' view'}>
			<button
				className={clsx('relative flex items-center justify-center rounded-sm cursor-pointer hover:bg-neutral-200 size-full p-2', { 'bg-neutral-200': active })}
				onClick={() => onClick()}
			>
				<AccessibleIcon.Root label={label}>
					{icon}
				</AccessibleIcon.Root>
			</button>
		</WithTooltip>

	return (
		<ul className={clsx(className, 'bg-light flex justify-center items-center gap-x-5 outline-1 p-1 outline-neutral-200 rounded-md')}>
			<li className='size-full' key={'desktop'}>
				<Item
					label={'desktop'}
					active={'desktop' === breakpoint}
					onClick={() => setBreakpoint('desktop')}
					icon={<DesktopIcon />}
				/>
			</li>
			<li className='size-full' key={'tablet'}>
				<Item
					label={'tablet'}
					active={'tablet' === breakpoint}
					onClick={() => setBreakpoint('tablet')}
					icon={<BoxIcon />}
				/>
			</li>
			<li className='size-full' key={'mobile'}>
				<Item
					label={'mobile'}
					active={'mobile' === breakpoint}
					onClick={() => setBreakpoint('mobile')}
					icon={<MobileIcon />}
				/>
			</li>
		</ul>
	)
}

const MainHeader = (
	{ onBack, content, menu, setMenu, breakpoint, setBreakpoint }: {
		onBack: () => void,
		content: boolean,
		menu: boolean,
		setMenu: (value: boolean) => void,
		breakpoint: string,
		setBreakpoint: (breakpoint: Device) => void
	}
) => (
	<header className='z-50 sticky top-0 left-0 right-0 size-full grid grid-cols-3 items-center min-h-20 *:w-auto pointer-events-none'>
		<button onClick={() => onBack()} className='justify-self-start cursor-pointer flex justify-center items-center hover:bg-neutral-200 rounded-md p-2 text-center pointer-events-auto'>
			<AccessibleIcon.Root label='Back'>
				<ChevronLeftIcon />
			</AccessibleIcon.Root>
		</button>
		{
			content
				? <>
					<Breakpoint
						className='justify-self-center pointer-events-auto'
						breakpoint={breakpoint}
						setBreakpoint={setBreakpoint}
					/>
					<button onClick={e => { e.stopPropagation(); setMenu(!menu) }} className='pointer-events-auto p-2 justify-self-end cursor-pointer flex gap-x-2 justify-center items-center hover:bg-neutral-200 rounded-md' >
						<AccessibleIcon.Root label='Toggle SEO settings'>
							<ViewVerticalIcon />
						</AccessibleIcon.Root>
					</button>
				</>
				: null
		}
	</header>
)

const changes = (prev: Partial<Project>, curr: Partial<Project>): Partial<Project> =>
	Object.entries(curr)
		.filter(([k, v]) =>
			!Object.is(prev[k as keyof Partial<Project>], v)
		)
		.reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {})

const formatAssets = (id: string, images: Photos): Photos => images.map(v => {
	return { ...v, src: toStorageURL(id + '/' + v.id + '.jpeg') }
})

const formatChanges = (id: string, changes: Partial<Project>) => {
	if('assets' in changes) {
		const assets = formatAssets(id, changes.assets!)
		return { ...changes, id, assets }
	} else {
		return { ...changes, id }
	}
}

const Left = ({ onDelete, asset, onDrag, onDrop }: {
	onDelete: (items: Photos) => void,
	asset: Asset,
	onDrag: UseDragListener,
	onDrop: UseDragListener
}) => {
	const [actives, setActives] = useState<number[]>([])
	const ref = useRef<HTMLUListElement>(null)

	const onClick = curry((index: number, e: PointerEvent | MouseEvent) => {
		const ctrl = e.ctrlKey
		const shift = e.shiftKey

		e.stopPropagation()

		setActives(actives => {
			const ascending = (numbers: number[]) => numbers.toSorted((a, b) => a - b)
			const ranges = (from: number, to: number, acc: number[]): number[] =>
				(to - from) <= 0
					? ([...acc, from])
					: ranges(from + 1, to, [...acc, from])

			const shiftFn = (number: number, numbers: number[]): number[] => {
				const sorted = ascending([...numbers, number])
				const from = sorted[0]
				const to = sorted[sorted.length - 1]
				return ranges(from, to, [])
			}

			const ctrlFn = (number: number, numbers: number[]): number[] =>
				ascending([...numbers, number]).reduce((a, b) => {
					if(a.includes(b)) {
						return a.filter(v => v !== b)
					} else {
						return a.concat([b])
					}
				}, [] as number[])

			const clickFn = (number: number): number[] => ([number])

			const table: [boolean, (number: number, numbers: number[]) => number[]][] = [
				[shift, shiftFn],
				[ctrl, ctrlFn],
				[!(ctrl || shift), clickFn]
			]

			const result: number[] = table.reduce((a, [v, fn]) => {
				if(v) {
					return fn(index, a)
				} else {
					return a
				}
			}, actives)

			return result
		})
	})

	const onContextMenu = curry((index: number, _event: PointerEvent | MouseEvent) => {
		setActives([index])
	})

	const items = Object.values(asset)

	useEffect(() => {
		const listener = (e: { key: string }) => {
			if(e.key === 'Delete') {
				const items = [...ref.current!.children] as HTMLLIElement[]
				const actives = items.filter(v => v.dataset.active === 'true').map(v => {
					return {
						id: v.dataset.id || '',
						src: v.dataset.src || '',
						alt: v.dataset.alt || '',
						width: Number(v.dataset.width),
						height: Number(v.dataset.height),
						thumbnail: v.dataset.thumbnail === 'true'
					}
				})

				if(actives.length > 0) {
					onDelete(actives)
				}
			}
		}

		document.addEventListener('keydown', listener)

		return () => { document.removeEventListener('keydown', listener) }
	}, [])

	useEffect(() => () => setActives([]), [items.length])

	type DragEvent = { x: number, y: number, dx: number, dy: number, subject: { x: number, y: number } }

	const Group = ({ x0, y0, x1, y1, onDragStart, onDrag, onDragEnd, onClick }: {
		onDragStart: (e: DragEvent) => void,
		onDrag: (e: DragEvent) => void,
		onDragEnd: (e: DragEvent) => void,
		onClick: (e: PointerEvent | MouseEvent) => void,
		x0: number,
		y0: number,
		x1: number,
		y1: number
	}) => {
		const ref = useDrag<HTMLDivElement>({
			modifier: drag => drag.clickDistance(1).filter(e =>
				!e.ctrlKey && !e.shiftKey && !e.button
			),
			onDragStart: e => onDragStart(e),
			onDrag: e => onDrag(e),
			onDragEnd: e => onDragEnd(e)
		})
		return <div
			ref={ref}
			onClick={onClick}
			className='absolute top-0 left-0'
			style={{
				transform: `translate(${x0}px, ${y0}px)`,
				width: (x1 - x0) + 'px',
				height: (y1 - y0) + 'px'
			}}
		/>
	}

	const Item = ({ index, active, item, onDragStart, onDrag, onDragEnd, onClick }: {
		index: number,
		active: boolean,
		item: Photo,
		onDragStart: (e: DragEvent) => void,
		onDrag: (e: DragEvent) => void,
		onDragEnd: (e: DragEvent) => void,
		onClick: (e: PointerEvent | MouseEvent) => void
	}) => {
		const ref = useDrag<HTMLLIElement>({
			modifier: drag => drag.clickDistance(1).filter(e =>
				!e.ctrlKey && !e.shiftKey && !e.button
			),
			onDragStart: e => onDragStart(e),
			onDrag: e => onDrag(e),
			onDragEnd: e => onDragEnd(e)
		})

		return (
			<li
				ref={ref}
				className='w-full h-auto data-[active=true]:outline-2 data-[active=true]:outline-blue-500'
				onClick={onClick}
				onContextMenu={onContextMenu}
				data-active={active}
				data-index={index}
				data-id={item.id}
				data-src={item.src}
				data-alt={item.alt}
				data-width={item.width}
				data-height={item.height}
				data-thumbnail={item.thumbnail}
			>
				<img
					className='object-cover object-center w-full h-40 select-none'
					width={item.width}
					height={item.height}
					alt={`${item.alt} Designed By ${siteName}`}
					src={item.src}
				/>
			</li>
		)
	}

	const getItems = () => {
		const items = [...ref.current!.children].filter(v => {
			const el = v as HTMLLIElement
			return el.dataset.active === 'true'
		})

		return items.map(v => {
			const { dataset } = v as HTMLLIElement
			return {
				id: dataset.id,
				src: dataset.src,
				alt: dataset.alt,
				width: Number(dataset.width),
				height: Number(dataset.height),
				thumbnail: dataset.thumbnail === 'true'
			}
		})
	}

	const onGroupDragStart = () => { }

	const onGroupDrag = (event: DragEvent) =>
		onDrag({
			x: event.x,
			y: event.y,
			items: getItems()
		})

	const onGroupDragEnd = (event: DragEvent) => {
		const moved = event.x - event.subject.x || event.y - event.subject.y
		if(moved) {
			onDrop({
				x: event.x,
				y: event.y,
				items: getItems()
			})
		}
	}

	const onGroupClick = (event: MouseEvent | PointerEvent) => {
		const [item] = [...ref.current!.children].filter(v => {
			const r = v.getBoundingClientRect()
			const xs = between(r.x, r.x + r.width, event.clientX)
			const ys = between(r.y, r.y + r.height, event.clientY)
			return xs && ys
		})

		const el = item as HTMLLIElement
		const index = Number(el.dataset.index)

		onClick(index, event)
	}

	const onItemDragStart = curry((index: number, _event: DragEvent) => {
		setActives([index])
	})

	const onItemDrag = curry((_index: number, event: DragEvent) =>
		onDrag({
			x: event.x,
			y: event.y,
			items: getItems()
		})
	)

	const onItemDragEnd = curry((index: number, event: DragEvent) => {
		const moved = event.x - event.subject.x || event.y - event.subject.y
		if(moved) {
			onDrop({
				x: event.x,
				y: event.y,
				items: getItems()
			})
		}
	})

	const calcGroupRect = (actives: number[]) =>
		actives.reduce(
			(acc, index) => {
				const r = [...ref.current!.children][index].getBoundingClientRect()
				return {
					x0: Math.min(r.x, acc.x0),
					y0: Math.min(r.y, acc.y0),
					x1: Math.max(r.x + r.width, acc.x1 - acc.x0),
					y1: Math.max(r.y + r.height, acc.y1 - acc.y0)
				}
			},
			{ x0: Infinity, y0: Infinity, x1: -Infinity, y1: -Infinity }
		)

	const onClear = () => setActives([])

	return (
		<div
			onClick={onClear}
			className='size-full relative flex flex-col items-center'
		>
			{
				<ul
					ref={ref}
					className={
						clsx('size-full p-4 flex flex-col items-center gap-y-4 overflow-y-auto', { 'hidden': items.length === 0 })
					}
				>
					{
						items.map((item, i) =>
							<Item
								key={item.id}
								index={i}
								item={item}
								active={actives.includes(i)}
								onDragStart={onItemDragStart(i)}
								onDrag={onItemDrag(i)}
								onDragEnd={onItemDragEnd(i)}
								onClick={onClick(i)}
							/>
						)
					}
					<style jsx>
						{`ul { scrollbar-width: thin; }`}
					</style>
				</ul>
			}
			{
				actives.length > 1
					? <Group
						onClick={onGroupClick}
						onDragStart={onGroupDragStart}
						onDrag={onGroupDrag}
						onDragEnd={onGroupDragEnd}
						{...calcGroupRect(actives)}
					/>
					: null
			}
			{
				items.length === 0
					? <div className='size-full p-4 flex flex-col justify-center items-center'>
						<p className='font-sans text-neutral-500 uppercase text-base font-medium'>No images</p>
					</div>
					: null
			}
		</div>
	)
}

const Overlay = ({ x, y, items }: { x: number, y: number, items: Photos }) => {
	const initialSize = 80
	const offset = .1
	const size = items.reduce(a => a + (offset * initialSize), -offset * initialSize) + initialSize
	return (
		<div className='z-50 fixed inset-0'>
			<div className='relative size-full'>
				<div
					style={{ translate: `calc(${x}px - 50%) calc(${y}px - 50%)` }}
					className='absolute top-0 left-0 cursor-move bg-neutral-300/50'
				>
					<div className='relative size-full p-2'>
						<ul style={{ width: size + 'px', height: size + 'px' }} className='relative opacity-80'>
							{
								items.map((v, i) =>
									<li
										key={v.id}
										style={{ translate: `${i * (initialSize * offset)}px ${i * (initialSize * offset)}px` }}
										className='absolute top-0 left-0 size-20'
									>
										<img
											className='size-full object-cover object-center'
											src={v.src}
											alt={v.alt}
											width={v.width}
											height={v.height}
										/>
									</li>
								)
							}
						</ul>
						<span className='absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 size-5 rounded-full bg-blue-500 flex flex-col justify-center items-center text-center'>
							<small className='font-bold text-tiny text-light'>{items.length > 100 ? '...' : items.length}</small>
						</span>
					</div>
				</div>
			</div>
		</div >
	)
}

const Edit = ({ project }: { project: Project }) => {
	const [previous, setPrevious] = useState<Partial<Project>>(() => {
		return {
			assets: project.assets,
			template: project.template,
			name: project.name,
			location: project.location,
			story: project.story,
			tagline: project.tagline,
			slug: project.slug,
			title: project.title,
			description: project.description,
			featured: project.featured,
			published: project.published,
			category: project.category
		}
	})

	const [assets, setAssets] = useState(project.assets)
	const [template, setTemplate] = useState(project.template)
	const [name, setName] = useState(project.name)
	const [location, setLocation] = useState(project.location)
	const [story, setStory] = useState(project.story)
	const [tagline, setTagline] = useState(project.tagline)
	const [slug, setSlug] = useState(project.slug)
	const [title, setTitle] = useState(project.title)
	const [description, setDescription] = useState(project.description)
	const [featured, setFeatured] = useState(project.featured)
	const [published, setPublished] = useState(project.published)
	const [category, setCategory] = useState(project.category)

	const [errors, setErrors] = useState<string[]>([])

	const sensorRef = useRef<HTMLDivElement>(null!)

	const [over, setOver] = useState(false)

	const [uploadQueues, setUploadQueues] = useState<number[]>([])
	const [overlay, setOverlay] = useState<{ x: number, y: number, items: Photos }>({ x: 0, y: 0, items: [] })
	const [menu, setMenu] = useState(false)
	const [bucket, setBucket] = useState(false)
	const [breakpoint, setBreakpoint] = useState<Device>('desktop')
	const [controllers, setControllers] = useState<AbortController[]>([])
	const [broadcast, setBroadcast] = useState<BroadcastChannel | null>(null)

	const [assetDialog, setAssetDialog] = useState<{ open: boolean, assets: Photos, input: string }>({
		open: false,
		input: '',
		assets: [],
	})

	const [alert, setAlert] = useState({
		open: false,
		title: '',
		description: '',
		cancel: { text: '', color: '', callback: () => { } },
		action: { text: '', color: '', callback: () => { } },
	})

	const [toast, setToast] = useState<{ open: boolean, description: React.ReactNode, title: string }>({
		open: false,
		title: '',
		description: null
	})

	const router = useRouter()

	const current: Partial<Project> = {
		assets: assets,
		template: template,
		name: name,
		location: location,
		story: story,
		tagline: tagline,
		slug: slug,
		title: title,
		description: description,
		featured: featured,
		published: published,
		category: category
	}

	const showSuccessToast = ({ title, description }: { title: string, description: string | React.ReactNode }) =>
		setToast({
			open: true,
			title: title,
			description: (
				<>
					<span>{<CheckCircledIcon className='text-green-500' />}</span>
					<span>{description}</span>
				</>
			)
		})

	const showErrorToast = ({ title, description }: { title: string, description: string | React.ReactNode }) =>
		setToast({
			open: true,
			title: title,
			description: (
				<>
					<span>{<CrossCircledIcon className='text-red-500' />}</span>
					<span>{description}</span>
				</>
			)
		})

	const showInfoToast = ({ title, description }: { title: string, description: string | React.ReactNode }) =>
		setToast({
			open: true,
			title: title,
			description: (
				<>
					<span>{<InfoCircledIcon className='text-yellow-500' />}</span>
					<span>{description}</span>
				</>
			)
		})

	const uploadAssets = (files: File[]) =>
		compressFromFiles(files).then(
			blobs => filesToPhotos(blobs).then(
				(imgs) => {
					const uploads: [string, Blob][] = imgs.map((img, i) => {
						return [project.id + '/' + img.id + '.jpeg', blobs[i]]
					})
					const controller = new AbortController()
					const time = Date.now()

					setControllers(prev =>
						prev.concat([controller])
					)
					setAssets(prev =>
						prev.concat(imgs)
					)
					setUploadQueues(v =>
						v.concat([time])
					)
					setBucket(false)
					setAssetDialog({
						open: true,
						assets: imgs,
						input: ''
					})
					uploadFiles(controller.signal, uploads).then(
						() => setUploadQueues(v =>
							v.filter(v => v !== time)
						),
						() => showErrorToast({
							title: 'Storage error',
							description: 'Error when uploading image files.'
						})
					)
				}
			),
			() => showErrorToast({
				title: 'Image error',
				description: 'Error when loading image files.'
			})
		)

	const deleteAssets = (deletes: Photo[]) => {
		const ids = deletes.map(v => v.id)
		const paths = formatAssets(project.id, deletes).map(v => v.src)

		setAssets(assets =>
			assets.filter(v =>
				!ids.includes(v.id)
			)
		)

		setTemplate(template =>
			Object.entries(template).reduce((a, [key, value]) => {
				const items = value.items.filter(v =>
					!ids.includes(v.src)
				)
				const height = items.length > 0
					? Math.max(
						...items.map(v => v.y + v.h)
					)
					: 0
				return { ...a, [key]: { ...value, items, height } }
			}, {}) as Template
		)

		deleteFiles(paths).catch(() =>
			showErrorToast({
				title: 'Storage error',
				description: 'Error when deleting image files.'
			})
		)
	}

	const updateLayout = (fn: (layout: Layout) => Layout) =>
		setTemplate((template: Template) => {
			const result = fn(template[breakpoint])
			const current = { ...result, edited: true }
			return Object.entries(template)
				.filter(([key]) => key !== breakpoint)
				.reduce((acc, [key, value]) => {
					if(value.edited) {
						return { ...acc, [key]: value }
					} else {
						const ratio = value.width / current.width
						const items = current.items.map(item => {
							const box = {
								x: item.x * ratio,
								y: item.y * ratio,
								w: item.w * ratio,
								h: item.h * ratio
							}
							return { ...item, ...box }
						})
						const height = items.length > 0
							? Math.max(
								...items.map(v => v.y + v.h)
							)
							: 0
						return {
							...acc,
							[key]: { ...value, items, height }
						}
					}
				}, { [breakpoint]: current }) as Template
		})

	const onBack = () => {
		const change = changes(previous, current)
		const back = () => {
			assets.filter(v =>
				v.src.startsWith('blob')
			).forEach(v =>
				URL.revokeObjectURL(v.src)
			)
			broadcast?.close()
			setPrevious(prev => {
				return { ...prev, ...change }
			})
			router.push('/dashboard/projects')
		}

		if(Object.keys(change).length > 0) {
			const update = formatChanges(project.id, change)
			const exit = () => updateProject(update).then(
				() => {
					rebuildPath('/', 'layout')
					// rebuildPath('/services')
					// rebuildPath('/projects')
					// rebuildPath('/projects/[slug]')
					// rebuildPath(`/projects/${current.slug}`)
					back()
				},
				back
			)
			if(uploadQueues.length > 0) {
				setAlert({
					open: true,
					title: 'Upload in progress',
					description: 'Upload is incomplete. Do you still want to cancel?',
					action: {
						text: 'Yes',
						color: '',
						callback: () => {
							controllers.forEach(controller =>
								controller.abort()
							)
							exit()
						}
					},
					cancel: {
						text: 'No',
						color: '',
						callback: () => { }
					},
				})
			} else {
				exit()
			}
		} else {
			back()
		}
	}

	const onUnpublish = () => {
		const change = changes(previous, { ...current, published: false })
		const task = Object.keys(change).length > 0
			? updateProject(
				formatChanges(project.id, change)
			).then(() => {
				setPrevious(v => {
					return { ...v, ...change }
				})
				rebuildPath('/', 'layout')
				// rebuildPath('/services')
				// rebuildPath('/projects')
				// rebuildPath('/projects/[slug]')
				// rebuildPath(`/projects/${current.slug}`)

			})
			: Promise.resolve()

		setPublished(false)

		task.then(
			() => showSuccessToast({
				title: 'Success',
				description: 'Project has been unpublished.'
			}),
			() => showErrorToast({
				title: 'Database error',
				description: 'Error when unpublishing project.'
			})
		)
	}

	const onPublish = () => {
		type StringKeysOf<T> = {
			[K in keyof T]: T[K] extends string ? K : never
		}[keyof T]
		const fields: StringKeysOf<Project>[] = [
			'name',
			'location',
			'story',
			'tagline',
			'slug',
			'title',
			'description',
			'slug',
			'title',
			'description'
		]
		const missings = fields.filter(v => (current[v] as string).trim() === '')
		const contents = Object.values(template).map(v => v.items)
		if(missings.length > 0) {
			const keys: StringKeysOf<Project>[] = ['slug', 'title', 'description']
			setErrors(missings)
			setMenu(
				keys.some(v =>
					missings.includes(v)
				)
			)
			showErrorToast({
				title: 'Missing fields.',
				description: 'Fields cannot be empty.'
			})
		} else if(contents.some(contents => contents.length === 0)) {
			showErrorToast({
				title: 'Insufficient number of images.',
				description: 'In order to publish, project require at least one image on each viewport.'
			})
		} else {
			const changed: Partial<Project> = changes(previous, { ...current, published: true })
			const entries: [string, Project[keyof Project]][] = Object.entries(changed)

			const change = entries.reduce(
				(a, [k, v]) => ({
					...a,
					[k]: fields.includes(k as StringKeysOf<Project>)
						? (v as string).trim()
						: v
				}),
				{}
			)

			const task = Object.keys(change).length > 0
				? updateProject(
					formatChanges(project.id, {
						...change,
						published_at: new Date().toISOString()
					})
				).then(() => {
					setPrevious(prev => {
						return { ...prev, ...change }
					})
					rebuildPath('/', 'layout')
					// rebuildPath('/services')
					// rebuildPath('/projects')
					// rebuildPath('/projects/[slug]')
					// rebuildPath(`/projects/${current.slug}`)
				})
				: Promise.resolve()

			setPublished(true)

			task.then(
				() => showSuccessToast({
					title: 'Success',
					description: 'Project has been published.'
				}),
				() => showErrorToast({
					title: 'Database error',
					description: 'Error when publishing project.'
				})
			)
		}
	}

	const onDelete = () => setAlert({
		open: true,
		title: 'Delete project',
		description: 'This will permanently delete project data.',
		cancel: {
			text: 'Cancel',
			color: '',
			callback: () => { }
		},
		action: {
			text: 'Delete',
			color: 'text-red-500',
			callback: () => Promise.all([
				deleteProject(project.id),
				deleteFiles(
					formatAssets(project.id, assets).map(v => v.src)
				)
			]).then(
				() => {
					assets.filter(v =>
						v.src.startsWith('blob')
					).forEach(v =>
						URL.revokeObjectURL(v.src)
					)
					rebuildPath('/', 'layout')
					// rebuildPath('/services')
					// rebuildPath('/projects')
					// rebuildPath('/projects/[slug]')
					// rebuildPath(`/projects/${current.slug}`)
					router.push('/dashboard/projects')
				},
				() => showErrorToast({
					title: 'Database error',
					description: 'Error when deleting project.'
				})
			)
		}
	})

	const onPreview = () => {
		const change = changes(previous, current)
		const task = Object.keys(change).length > 0
			? updateProject(
				formatChanges(project.id, change)
			).then(() => {
				setPrevious(prev => {
					return { ...prev, ...change }
				})
				rebuildPath('/', 'layout')
				// rebuildPath('/services')
				// rebuildPath('/projects')
				// rebuildPath('/projects/[slug]')
				// rebuildPath(`/projects/${current.slug}`)
			})
			: Promise.resolve()

		const broadcaster = broadcast ?? new BroadcastChannel(project.id)

		setBroadcast(broadcaster)

		const openPreview = () => new Promise<void>((resolve, reject) => {
			const tab = window.open('/preview/' + project.id, project.id)
			if(tab) {
				const timeout = setTimeout(() => {
					broadcaster.postMessage(current)
					resolve()
					clearTimeout(timeout)
				}, 5000)
				broadcaster.postMessage(current)
			} else {
				reject()
			}
		})

		task.then(
			() => {
				openPreview().catch(() => {
					const onClick = () => {
						const timeout = setTimeout(() => {
							broadcaster.postMessage(current)
							clearTimeout(timeout)
						}, 5000)
					}
					showInfoToast({
						title: 'Preview error',
						description: (
							<>Unable to open preview. <a onClick={onClick} href={'/preview/' + project.id} target='_blank'>Click here</a> to open preview manually.</>
						)
					})
				})
			},
			() => showErrorToast({
				title: 'Database error',
				description: 'Error when updating project.'
			})
		)
	}

	const updateAsset = (fn: (asset: Asset) => Asset) =>
		setAssets(assets => {
			const left = Object.fromEntries(
				assets.map(v => {
					return [v.id, v]
				})
			)
			const right = fn(left)
			return Object.values({ ...left, ...right })
		})

	useEffect(() => () => {
		controllers.forEach(controller =>
			controller.abort()
		)
		broadcast?.close()
	}, [])

	useEffect(() => {
		const change = changes(previous, current)
		const changed = Object.keys(change).length > 0
		if(changed) {
			const timeouts = [
				setTimeout(() => {
					updateProject(
						formatChanges(project.id, change)
					).then(
						() => {
							setPrevious(prev => {
								return { ...prev, ...change }
							})
							rebuildPath('/', 'layout')
							// rebuildPath('/services')
							// rebuildPath('/projects')
							// rebuildPath('/projects/[slug]')
							// rebuildPath(`/projects/${current.slug}`)
						},
						() => showErrorToast({
							title: 'Database error',
							description: 'Error when saving project.'
						})
					)
				}, 3000),
				setTimeout(() => broadcast?.postMessage(current), 1500)
			]

			return () => { timeouts.forEach(clearTimeout) }
		}
	}, [
		featured,
		category,
		published,
		name,
		location,
		story,
		tagline,
		slug,
		title,
		description,
		template,
		assets
	])

	const splitAsset = (items: Items, assets: Photos) =>
		assets.reduce((a, b) => {
			if(items.some(v => v.src === b.id)) {
				return { ...a, used: { ...a.used, [b.id]: b } }
			} else {
				return { ...a, unused: { ...a.unused, [b.id]: b } }
			}
		}, { unused: {}, used: {} })

	const layout = template[breakpoint]
	const { used, unused } = splitAsset(layout.items, assets)
	const remainingAsset = Object.values(unused)

	const onDrag = (e: { x: number, y: number, items: Photos }) => {
		const dropable = sensorRef.current
		const r = dropable.getBoundingClientRect()
		const inside = clamp(r.x, r.x + r.width, e.x) === e.x && clamp(r.y, r.y + r.height, e.y) === e.y

		setOver(inside)
		setOverlay(e)
	}

	const onDrop = (e: { x: number, y: number, items: Photos }) => {
		const dropable = sensorRef.current
		const r = dropable.getBoundingClientRect()
		const inside = clamp(r.x, r.x + r.width, e.x) === e.x && clamp(r.y, r.y + r.height, e.y) === e.y

		if(inside) {
			setOver(false)
			updateLayout(layout => {
				const items = layout.items.concat(
					e.items.map((image, i) => {
						const size = layout.width / 3
						const scaled = Math.min(image.width / size, image.height / size) * size
						const offset = .05 * size * i
						const result = applyBoxConstrain(
							{ x: 0, y: 0, w: layout.width, h: Infinity },
							{
								id: UUIDv7(),
								src: image.id,
								z: 0,
								x: (e.x - r.x) - (size * .5) + offset,
								y: (e.y - r.y) - (size * .5) + offset,
								w: size,
								h: size,
								sx: ((image.width - scaled) * .5) / image.width,
								sy: ((image.height - scaled) * .5) / image.height,
								sw: scaled / image.width,
								sh: scaled / image.height,
								effect: ''
							}
						)
						return result
					})
				)
				const height = Math.max(
					...items.map(v => v.y + v.h)
				)

				return { ...layout, items, height }
			})
			setOverlay({ x: 0, y: 0, items: [] })
		} else {
			setOverlay({ x: 0, y: 0, items: [] })
		}
	}

	const focusRef = useRef<HTMLInputElement>(null)

	const onSkip = () => {
		setBucket(true)
		setAssetDialog({ assets: [], open: false, input: '' })
	}

	const onNext = () => {
		const [x, ...xs] = assetDialog.assets

		updateAsset(asset => {
			return {
				...asset,
				[x.id]: {
					...x,
					alt: alternative(
						assetDialog.input.trim()
					)
				}
			}
		})
		setAssetDialog({
			open: xs.length > 0,
			input: '',
			assets: xs
		})
		setBucket(xs.length === 0)
	}

	const onEnter = (e: React.KeyboardEvent) => {
		if(e.key === 'Enter') {
			e.preventDefault()
			onNext()
		}
	}

	const onClear = () => {
		setMenu(false)
		setBucket(false)
	}

	return (
		<>
			<section
				className='min-h-[100dvh] size-full grid grid-rows-[auto_1fr_auto] place-items-center px-10'
				onClick={onClear}
				onContextMenu={onClear}
			>
				<MainHeader
					onBack={onBack}
					content={assets.length > 0}
					menu={menu}
					setMenu={setMenu}
					breakpoint={breakpoint}
					setBreakpoint={setBreakpoint}
				/>
				{
					assets.length > 0
						? <Droppable
							className='size-full'
							noClick={true}
							onDrop={uploadAssets}
						>
							<article className='flex flex-col items-center size-full py-10 gap-y-30'>
								<MainEditorHeader
									errors={errors}
									name={name}
									setName={setName}
									location={location}
									setLocation={setLocation}
									tagline={tagline}
									setTagline={setTagline}
									story={story}
									setStory={setStory}
								/>
								<div className='relative size-full'>
									<MainEditorBody
										key={layout.width}
										asset={used}
										setAsset={updateAsset}
										layout={layout}
										setLayout={updateLayout}
									/>
									<div className='absolute top-0 left-0 size-full flex flex-col justify-center items-center pointer-events-none'>
										<div
											ref={sensorRef}
											style={{ width: layout.width + 'px', height: '100%' }}
											className={clsx({ 'outline-1 outline-blue-500': over })}
										/>
									</div>
								</div>
							</article >
						</Droppable>
						: <MainUpload uploadAssets={uploadAssets} />
				}
				{
					assets.length > 0
						? <div className='sticky bottom-0 left-0 right-0 size-full flex justify-center items-center min-h-20 pointer-events-none z-50'>
							<ul className='flex justify-center items-center rounded-md p-1 bg-light outline-1 outline-neutral-200 *:size-full gap-x-5 *:*:flex *:*:justify-center *:*:items-center *:*:p-2 *:*:rounded-md *:*:hover:bg-neutral-200 *:*:pointer-events-auto *:*:cursor-pointer'>
								<li>
									<button
										className={clsx('relative', { 'bg-neutral-200': bucket })}
										onClick={e => { e.stopPropagation(); setBucket(!bucket) }}
									>
										<AccessibleIcon.Root label='Show images'>
											<ImageIcon />
										</AccessibleIcon.Root>
										{
											remainingAsset.length > 0
												? <small className='absolute flex flex-col justify-center items-center top-0 left-full -translate-1/2 rounded-full bg-orange-500 text-center size-5 text-light text-tiny font-bold align-middle'>
													{remainingAsset.length > 100 ? '...' : remainingAsset.length}
												</small>
												: null
										}
									</button>
								</li>
								<li>
									<DropdownMenu.Root>
										<DropdownMenu.Trigger className='data-[state=open]:bg-neutral-200 outline-1 outline-transparent'>
											<AccessibleIcon.Root label='Show layouts options'>
												<GearIcon />
											</AccessibleIcon.Root>
										</DropdownMenu.Trigger>
										<DropdownMenu.Portal>
											<DropdownMenu.Content
												sideOffset={13}
												side='top'
												className='
													flex 
													flex-col 
													justify-center 
													gap-y-0.5
													font-sans 
													font-semibold 
													text-sm 
													z-50 
													bg-light 
													ring-1
													ring-neutral-200 
													rounded-md 
													p-1
												'
											>
												{
													breakpoints.filter(v => v !== breakpoint).map(screen =>
														<DropdownMenu.Item
															key={screen}
															className='capitalize rounded-md px-3 py-1.5 cursor-pointer hover:bg-neutral-200 outline-1 outline-transparent'
															onSelect={() =>
																updateLayout(layout => {
																	const base = template[screen as keyof Template]
																	const ratio = layout.width / base.width
																	const items = base.items.map(item => {
																		const box = {
																			x: item.x * ratio,
																			y: item.y * ratio,
																			w: item.w * ratio,
																			h: item.h * ratio
																		}
																		return { ...item, ...box }
																	})
																	const height = items.length > 0
																		? Math.max(
																			...items.map(v => v.y + v.h)
																		)
																		: 0

																	return { ...layout, items, height }
																})
															}
														>
															{`Apply ${screen} layout`}
														</DropdownMenu.Item>
													)
												}
											</DropdownMenu.Content>
										</DropdownMenu.Portal>
									</DropdownMenu.Root>
								</li>
							</ul>
						</div>
						: null
				}
			</section>
			{
				bucket
					? <section className='z-50 fixed top-0 left-0 w-xs h-dvh outline-1 outline-neutral-200 shadow-lg bg-light'>
						<Left
							key={layout.width + remainingAsset.length}
							asset={unused}
							onDrag={onDrag}
							onDrop={onDrop}
							onDelete={deleteAssets}
						/>
					</section>
					: null
			}
			{
				menu
					? <section className='z-50 fixed right-0 top-0 bottom-0 px-10 w-md grid grid-rows-[auto_max-content_1fr] gap-y-5 place-items-center outline-1 outline-neutral-200 shadow-lg bg-light'>
						<RightHeader
							published={published}
							onPublish={onPublish}
							onUnpublish={onUnpublish}
							onPreview={onPreview}
							menu={menu}
							setMenu={setMenu}
						/>
						<RightMain
							errors={errors}
							category={category}
							setCategory={setCategory}
							slug={slug}
							setSlug={setSlug}
							title={title}
							setTitle={setTitle}
							description={description}
							setDescription={setDescription}
							featured={featured}
							setFeatured={setFeatured}
						/>
						<RightFooter onDelete={onDelete} />
					</section>
					: null
			}
			{overlay.items.length > 0 ? <Overlay {...overlay} /> : null}
			<Toast.Provider>
				<Toast.Root
					className='bg-light rounded-lg px-3 py-1 font-sans text-base font-semibold outline-1 outline-neutral-200'
					open={toast.open}
					onOpenChange={open => setToast({ ...toast, open })}
				>
					<Toast.Title className='sr-only'>{toast.title}</Toast.Title>
					<Toast.Description className='flex justify-center items-center gap-x-1'>
						{toast.description}
					</Toast.Description>
				</Toast.Root>
				<Toast.Viewport className='fixed right-0 bottom-0 p-5 z-50' />
			</Toast.Provider>
			<AlertDialog.Root open={alert.open} onOpenChange={open => setAlert({ ...alert, open })}>
				<AlertDialog.Portal>
					<AlertDialog.Overlay className='z-50 fixed inset-0 bg-neutral-300/50' />
					<AlertDialog.Content
						className='
							flex
							flex-col
							gap-y-3
							justify-center
							font-sans 
							fixed 
							top-[50%] 
							left-[50%] 
							-translate-x-[50%] 
							-translate-y-[50%] 
							min-w-2xs 
							rounded-md 
							ring-1
							ring-neutral-200
							px-5
							py-2.5
							bg-light
							z-50
						'
					>
						<AlertDialog.Title className='font-semibold text-lg'>{alert.title}</AlertDialog.Title>
						<AlertDialog.Description className='font-semibold text-base text-neutral-500'>
							{alert.description}
						</AlertDialog.Description>
						<div className='font-bold text-base flex items-center justify-end gap-x-3 *:rounded-md *:cursor-pointer *:px-4 *:py-1 *:hover:bg-neutral-200'>
							<AlertDialog.Cancel onClick={alert.cancel.callback} className={alert.cancel.color}>{alert.cancel.text}</AlertDialog.Cancel>
							<AlertDialog.Action onClick={alert.action.callback} className={alert.action.color}>{alert.action.text}</AlertDialog.Action>
						</div>
					</AlertDialog.Content>
				</AlertDialog.Portal>
			</AlertDialog.Root>
			<AlertDialog.Root open={assetDialog.open} onOpenChange={open => setAssetDialog({ ...assetDialog, open })}>
				<AlertDialog.Portal>
					<AlertDialog.Overlay className='z-50 fixed inset-0 bg-neutral-300/50' />
					<AlertDialog.Content
						onKeyDown={onEnter}
						autoFocus={false}
						className='
							flex
							flex-col
							max-w-lg
							w-full
							items-center
							p-4
							gap-8
							font-sans 
							fixed 
							top-[50%] 
							left-[50%] 
							-translate-x-[50%] 
							-translate-y-[50%] 
							rounded-md 
							ring-1
							ring-neutral-200
							bg-light
							z-50
							focus:outline-1
							focus:outline-neutral-200
						'
					>
						{
							assetDialog.open
								? <img
									className='object-cover object-center aspect-square rounded-md'
									width={assetDialog.assets[0].width}
									height={assetDialog.assets[0].height}
									src={assetDialog.assets[0].src}
									alt={assetDialog.assets[0].alt}
								/>
								: null

						}
						<div className='flex flex-col items-center justify-center gap-1 text-center'>
							<AlertDialog.Title className='font-bold text-lg'>Set Image Description</AlertDialog.Title>
							<AlertDialog.Description className='font-semibold text-base text-neutral-500'>
								Write short description about this image.
							</AlertDialog.Description>
						</div>
						<fieldset>
							<label className='sr-only' htmlFor='asset'>Description</label>
							<input
								ref={focusRef}
								id='asset'
								autoFocus={true}
								className='px-2 py-1 rounded-md bg-neutral-200 outline-1 outline-neutral-200 focus:outline-amber-600 w-full font-semibold text-base'
								placeholder='e.g., Scandinavian chair'
								type='text'
								value={assetDialog.input}
								onChange={e => setAssetDialog({ ...assetDialog, input: e.target.value })}
							/>
						</fieldset>
						<div className='font-bold text-base flex items-center *:focus:outline-1 *:outline-neutral-200 justify-between w-full *:rounded-md *:cursor-pointer *:px-4 *:py-1 *:hover:bg-neutral-200'>
							<AlertDialog.Cancel className='text-neutral-500' onClick={onSkip}>Skip All</AlertDialog.Cancel>
							{
								assetDialog.assets.length > 1
									? <button onClick={() => { onNext(); focusRef.current!.focus() }}>Next</button>
									: <AlertDialog.Action onClick={onNext}>Done</AlertDialog.Action>
							}
						</div>
					</AlertDialog.Content>
				</AlertDialog.Portal>
			</AlertDialog.Root>
		</>
	)
}

export default Edit