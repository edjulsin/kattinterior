'use client'

import { CheckCircledIcon, CrossCircledIcon, DotsVerticalIcon, PersonIcon, PlusIcon, Cross1Icon, UploadIcon } from '@radix-ui/react-icons'
import { uploadFile, signOut, updateProfile, updateRole } from '@/action/client'
import { useRouter } from 'next/navigation'
import { AccessibleIcon, DropdownMenu, Dialog, Switch, AlertDialog } from 'radix-ui'
import { User } from '@/type/user'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import Droppable from './Droppable'
import { compressFromFiles, filesToPhotos, toStorageURL } from '@/utility/fn'
import { Status } from './Status'
import { isEmail } from 'validator'
import clsx from 'clsx'
import { inviteByEmail, deleteMember } from '@/action/server'

const Upload = (
    <span
        className='
            text-light 
            absolute 
            bottom-0 
            right-0 
            -translate-y-1/2 
            -translate-x-10/12 
            rounded-lg 
            p-0.5 
            backdrop-blur-xl 
            bg-neutral-600/50
        '
    >
        <UploadIcon />
    </span>
)

const ProfileDefaultWithUpload = (
    <div className='flex flex-col justify-center items-center bg-neutral-200 size-full relative'>
        <AccessibleIcon.Root label='Avatar'>
            <PersonIcon className='text-neutral-500 size-1/2' />
        </AccessibleIcon.Root>
        {Upload}
    </div>
)

const ProfileDefault = (
    <div className='flex flex-col justify-center items-center bg-neutral-200 size-full'>
        <AccessibleIcon.Root label='Avatar'>
            <PersonIcon className='text-neutral-500 size-1/2' />
        </AccessibleIcon.Root>
    </div>
)

const AlertCancel = (
    <AlertDialog.Cancel className='flex justify-center items-center rounded-md absolute top-5 right-5 cursor-pointer opacity-50 p-1 focus:outline-1 focus:outline-transparent'>
        <AccessibleIcon.Root label='Close'>
            <Cross1Icon />
        </AccessibleIcon.Root>
    </AlertDialog.Cancel>
)

const Profile = ({ user, onSave, open, onOpenChange, onError }: { user: User, open: boolean, onOpenChange: (open: boolean) => void, onSave: (user: User) => void, onError: () => void }) => {
    const [name, setName] = useState(user.name)
    const [avatar, setAvatar] = useState(user.avatar)

    const onUpload = (files: File[]) =>
        compressFromFiles(files).then(blobs =>
            filesToPhotos(blobs).then(photos => {
                const [blob] = blobs
                const [photo] = photos

                setAvatar({
                    id: photo.id,
                    src: photo.src,
                    width: photo.width,
                    height: photo.height
                })

                return uploadFile('avatars', `${user.id}/${photo.id}.jpeg`, blob).then(() => { }, onError)
            })
        )

    useEffect(() => () => {
        [avatar].filter(v => v.src.startsWith('blob')).forEach(v =>
            URL.revokeObjectURL(v.src)
        )
    }, [])

    const ProfilePicture = user.avatar
        ? <Image
            className='size-full object-center object-cover'
            width={avatar.width}
            height={avatar.height}
            src={avatar.src}
            alt={name || 'Anonymous'}
        />
        : null

    return (
        <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
            <AlertDialog.Portal>
                <AlertDialog.Overlay className='z-50 fixed inset-0 bg-neutral-300/50' />
                <AlertDialog.Content
                    className='
                        flex
                        flex-col
                        gap-y-5
                        justify-center
                        font-sans 
                        fixed 
                        top-[50%] 
                        left-[50%] 
                        -translate-x-[50%] 
                        -translate-y-[50%] 
                        min-w-xs
                        rounded-md 
                        ring-1
                        ring-neutral-200
                        p-5
                        bg-light
                        dark:bg-dark
                        z-50
                    '
                >
                    <div className='flex flex-col items-center justify-center'>
                        <AlertDialog.Title className='font-bold text-lg'>Profile</AlertDialog.Title>
                        <AlertDialog.Description className='font-semibold text-base opacity-50 capitalize'>
                            {user.role}
                        </AlertDialog.Description>
                    </div>
                    <form
                        className='flex flex-col items-center justify-center gap-y-5 w-full *:w-full *:flex *:flex-col *:items-center *:justify-center *:gap-y-2'
                        onSubmit={v => v.preventDefault()}
                    >
                        <fieldset>
                            <label htmlFor='avatar' className='sr-only'>Avatar</label>
                            <Droppable
                                id='avatar'
                                className='relative rounded-full overflow-clip focus:outline-1 focus:outline-amber-600 size-20 flex flex-col items-center justify-center bg-neutral-200 cursor-pointer'
                                onDrop={onUpload}
                            >
                                {ProfilePicture || ProfileDefaultWithUpload}
                                {Upload}
                            </Droppable>
                        </fieldset>
                        <small className='opacity-50 font-medium'>{user.email}</small>
                        <fieldset>
                            <label htmlFor='name' className='sr-only'>Name</label>
                            <input
                                type='text'
                                id='name'
                                className='px-4 py-2 rounded-md outline-1 outline-neutral-200 transition-colors focus:outline-amber-600 w-full font-semibold text-base'
                                value={name}
                                onChange={v => setName(v.target.value)}
                                placeholder='Your Name'
                            />
                        </fieldset>
                    </form>
                    {AlertCancel}
                    <AlertDialog.Action
                        className='focus:outline-1 focus:outline-amber-600 text-center font-bold text-base px-4 py-2 rounded-md cursor-pointer transition-colors bg-amber-600 text-light w-full'
                        onClick={() => onSave({ ...user, name, avatar })}
                    >
                        Save
                    </AlertDialog.Action>
                </AlertDialog.Content>
            </AlertDialog.Portal>
        </AlertDialog.Root>
    )
}

const Preview = ({ user, open, onOpenChange, onInvite, onDelete, usePromotion, onSave }: { onDelete: (user: User) => void, onSave: (user: User) => void, usePromotion: boolean, user: User, open: boolean, onOpenChange: (value: boolean) => void, onInvite: (email: string) => void }) => {
    const [role, setRole] = useState(user.role)
    const ProfilePicture = user.avatar
        ? <Image
            className='size-full object-center object-cover'
            src={user.avatar.src}
            width={user.avatar.width}
            height={user.avatar.height}
            alt={user.name || 'Anonymous'}
        />
        : null

    const checked = role === 'owner'

    const Promote = usePromotion ?
        <>
            <div className='flex items-center justify-center gap-x-2 rounded-full'>
                <Switch.Root
                    id='role'
                    className={clsx('peer transition-colors w-8 h-4 rounded-full outline-1 outline-transparent cursor-pointer', checked ? 'bg-amber-600' : 'bg-neutral-200')}
                    onCheckedChange={v => setRole(v ? 'owner' : 'contributor')}
                    checked={checked}
                >
                    <Switch.Thumb
                        className={clsx(
                            'block size-4 rounded-full bg-white shadow-md ring-1 ring-neutral-200 transition-[translate] will-change-transform ease-in-out duration-200',
                            checked ? 'translate-x-4' : 'translate-x-0'
                        )}
                    />
                </Switch.Root>
                <label className='text-sm font-medium cursor-pointer' htmlFor='role'>Promote to Owner</label>
            </div>
            <br />
        </>
        : null

    const Options = (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger autoFocus={false} className='cursor-pointer focus:outline-1 focus:outline-transparent opacity-50 absolute top-5 left-5 flex justify-center items-center p-1 rounded-md'>
                <AccessibleIcon.Root label='Options'>
                    <DotsVerticalIcon />
                </AccessibleIcon.Root>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
                <DropdownMenu.Content
                    sideOffset={5}
                    className='
                        flex 
                        flex-col 
                        justify-center 
                        font-sans 
                        text-sm 
                        font-semibold
                        z-50 
                        bg-light 
                        dark:bg-dark
                        ring-1
                        ring-neutral-200 
                        rounded-md 
                        p-1
                        *:data-highlighted:bg-amber-600 
					    *:data-highlighted:text-light
					    *:cursor-pointer
                        *:capitalize
                        *:rounded-md
                        *:px-3
                        *:py-1.5
                        *:outline-1
                        *:outline-transparent
                    '
                >
                    <AlertDialog.Cancel asChild>
                        <DropdownMenu.Item onSelect={() => onInvite(user.email)}>
                            Resend Invitation
                        </DropdownMenu.Item>
                    </AlertDialog.Cancel>
                    <AlertDialog.Cancel asChild>
                        <DropdownMenu.Item className='text-red-500' onSelect={() => onDelete(user)}>
                            Delete Member
                        </DropdownMenu.Item>
                    </AlertDialog.Cancel>
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    )

    return (
        <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
            <AlertDialog.Portal>
                <AlertDialog.Overlay className='z-50 fixed inset-0 bg-neutral-300/50' />
                <AlertDialog.Content
                    className='
                        flex
                        flex-col
                        gap-y-5
                        justify-center
                        items-center
                        font-sans 
                        fixed 
                        top-[50%] 
                        left-[50%] 
                        -translate-x-[50%] 
                        -translate-y-[50%] 
                        min-w-xs
                        rounded-md 
                        ring-1
                        ring-neutral-200
                        p-5
                        bg-light
                        dark:bg-dark
                        z-50
                        focus:outline-1
                        focus:outline-transparent
                    '
                >
                    <div className='flex flex-col items-center justify-center'>
                        <AlertDialog.Title className='font-bold text-lg'>Member</AlertDialog.Title>
                        <AlertDialog.Description className='font-semibold text-base opacity-50 capitalize'>
                            {user.role}
                        </AlertDialog.Description>
                    </div>
                    <div className='flex flex-col justify-center items-center gap-y-5'>
                        <div className='flex flex-col justify-center items-center size-20 rounded-full overflow-clip'>
                            {ProfilePicture || ProfileDefault}
                        </div>
                        <div className='flex flex-col justify-center items-center font-medium relative'>
                            <span>{user.name || 'Anonymous'}</span>
                            <span className='opacity-50 text-sm'>{user.email}</span>
                        </div>
                    </div>
                    {Options}
                    {Promote}
                    {AlertCancel}
                    <AlertDialog.Action
                        onClick={() => onSave({ ...user, role })}
                        className='focus:outline-1 focus:outline-amber-600 text-center font-bold text-base rounded-md cursor-pointer px-4 py-2 transition-colors bg-amber-600 text-light w-full'
                    >
                        Save Changes
                    </AlertDialog.Action>
                </AlertDialog.Content>
            </AlertDialog.Portal>
        </AlertDialog.Root>
    )
}

const Invite = ({ onInvite, open, onOpenChange }: { open: boolean, onOpenChange: (v: boolean) => void, onInvite: (email: string) => void }) => {
    const [email, setEmail] = useState('')
    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Portal>
                <Dialog.Overlay className='z-50 fixed inset-0 bg-neutral-300/50' />
                <Dialog.Content
                    className='
                        flex
                        flex-col
                        gap-y-5
                        justify-center
                        font-sans 
                        fixed 
                        top-[50%] 
                        left-[50%] 
                        -translate-x-[50%] 
                        -translate-y-[50%] 
                        min-w-xs
                        rounded-md 
                        ring-1
                        ring-neutral-200
                        p-5
                        bg-light
                        dark:bg-dark
                        z-50
                    '
                >
                    <div className='flex flex-col items-center justify-center text-center font-sans'>
                        <Dialog.Title className='font-bold text-xl'>Invite</Dialog.Title>
                        <Dialog.Description className='font-semibold opacity-50'>
                            Add new member to the team
                        </Dialog.Description>
                    </div>
                    <fieldset>
                        <label htmlFor='email' className='sr-only'>Email</label>
                        <input
                            type='text'
                            id='email'
                            autoFocus={true}
                            className='px-4 py-2 rounded-md outline-1 outline-neutral-200 transition-colors focus:outline-amber-600 w-full font-semibold text-base'
                            value={email}
                            onChange={v => setEmail(v.target.value)}
                            placeholder='member@mail.com'
                        />
                    </fieldset>
                    <Dialog.Close
                        className='focus:outline-1 focus:outline-amber-600 text-center font-bold text-base rounded-md cursor-pointer px-4 py-2 transition-colors bg-amber-600 text-light w-full'
                        onClick={() => onInvite(email)}
                    >
                        Invite
                    </Dialog.Close>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}
const Account = ({ user, members }: { user: User, members: User[] }) => {
    const [profileData, setProfileData] = useState(user)
    const [previewData, setPreviewData] = useState(user)
    const [showProfile, setShowProfile] = useState(false)
    const [showInvite, setShowInvite] = useState(false)
    const [showPreview, setShowPreview] = useState(false)
    const [team, setTeam] = useState(members)
    const [status, setStatus] = useState<{ open: boolean, title: string, description: React.ReactNode | string }>({
        open: false,
        title: '',
        description: null
    })
    const router = useRouter()
    const home = () => { router.push('/') }
    const logout = async () => signOut().then(
        () => { router.push('/login') },
        () => { router.push('/') }
    )

    const showSuccessStatus = ({ title, description }: { title: string, description: string | React.ReactNode }) =>
        setStatus({
            open: true,
            title: title,
            description: (
                <>
                    <span>{<CheckCircledIcon className='text-green-500' />}</span>
                    <span>{description}</span>
                </>
            )
        })

    const showErrorStatus = ({ title, description }: { title: string, description: string | React.ReactNode }) =>
        setStatus({
            open: true,
            title: title,
            description: (
                <>
                    <span>{<CrossCircledIcon className='text-red-500' />}</span>
                    <span>{description}</span>
                </>
            )
        })

    const onSave = async (user: User) =>
        Promise.all(
            [user].filter(v => !Object.is(profileData, v.avatar) || profileData.name !== v.name).map(v =>
                updateProfile({
                    ...v,
                    avatar: {
                        ...v.avatar,
                        src: toStorageURL('avatars', `${v.id}/${v.avatar.id}.jpeg`)
                    }
                }).then(
                    () => {
                        setProfileData(v)
                        showSuccessStatus({
                            title: 'Database Success',
                            description: 'Profile has been updated.'
                        })
                    },
                    () => showErrorStatus({
                        title: 'Database Error',
                        description: 'Error when updating user profile.'
                    })
                )
            )
        )

    const onInvite = async (email: string) =>
        Promise.all(
            [email + ''].filter(v => isEmail(v) && profileData.email !== email).map(email =>
                inviteByEmail(email).then(
                    users => {
                        setTeam(m =>
                            ([...m, ...users]).reduce<User[]>((a, b) => {
                                if(a.some(v => v.email === b.email)) {
                                    return a
                                } else {
                                    return [...a, b]
                                }
                            }, [])
                        )
                        showSuccessStatus({
                            title: 'Invitation Success',
                            description: 'Invitation has been sent.'
                        })
                    },
                    () => showErrorStatus({
                        title: 'Invitation Error',
                        description: 'Error when sending the invitation.'
                    })
                )
            )
        )

    const onPromote = (user: User) =>
        Promise.all(
            [user].filter(v => previewData.role !== v.role).map(v =>
                updateRole(v).then(
                    () => {
                        setPreviewData(v)
                        setTeam(m =>
                            m.map(m => v.id === m.id ? v : m)
                        )
                        showSuccessStatus({
                            title: 'Promotion Success',
                            description: `Successfully ${v.role === 'contributor' ? 'down' : 'up'}grading member to ${v.role}.`
                        })
                    },
                    () => showErrorStatus({
                        title: 'Promotion Error',
                        description: `Error when ${v.role === 'contributor' ? 'down' : 'up'}grading member to ${v.role}.`
                    })
                )
            )
        )

    const onDelete = (user: User) =>
        deleteMember(user).then(
            () => {
                setTeam(m =>
                    m.filter(v => user.id !== v.id)
                )
                showSuccessStatus({
                    title: 'Delete Success',
                    description: 'Successfully delete a member.'
                })
            },
            () => showErrorStatus({
                title: 'Delete Error',
                description: 'Error when deleting a member.'
            })
        )

    const onError = () => showErrorStatus({
        title: 'Storage Error',
        description: 'Error when uploading image file to storage.'
    })

    const profile = () => setShowProfile(!showProfile)
    const invite = () => setShowInvite(!showInvite)

    const ProfileDefault = <AccessibleIcon.Root label='Account'><PersonIcon /></AccessibleIcon.Root>

    const ProfilePicture = profileData.avatar
        ? <Image
            className='size-full object-center object-cover'
            src={profileData.avatar.src}
            width={profileData.avatar.width}
            height={profileData.avatar.height}
            alt={profileData.name || 'Anonymous'}
        />
        : null

    const Team = (
        <>
            <span className='px-4 py-2 opacity-50 text-sm font-medium pointer-events-none'>Team</span>
            {
                team.map(m => {
                    const ProfilePicture = m.avatar
                        ? <Image
                            className='size-full object-center object-cover'
                            src={m.avatar.src}
                            width={m.avatar.width}
                            height={m.avatar.height}
                            alt={m.name || 'Anonymous'}
                        />
                        : null

                    const onSelect = () => {
                        setPreviewData(m)
                        setShowPreview(true)
                    }

                    return (
                        <DropdownMenu.Item
                            key={m.id}
                            onSelect={onSelect}
                            className='flex gap-x-2 items-center px-4 py-2 rounded-lg outline-1'
                        >
                            <div className='size-8 overflow-clip rounded-full flex justify-center items-center'>
                                {ProfilePicture || ProfileDefault}
                            </div>
                            <div className='flex flex-col justify-center opacity-50 *:max-w-[125px] text-xs font-medium *:overflow-hidden *:text-ellipsis *:whitespace-nowrap'>
                                <span className='capitalize'>{m.name || 'anonymous'}</span>
                                <span>{m.email}</span>
                            </div>
                        </DropdownMenu.Item>
                    )
                })
            }
            <DropdownMenu.Item
                onSelect={invite}
                className='flex gap-x-2 items-center px-4 py-2 outline-1 rounded-lg'
            >
                <span>Invite new member</span>
                <span className='opacity-50'>
                    <PlusIcon />
                </span>
            </DropdownMenu.Item>
            <DropdownMenu.Separator className='bg-neutral-200 py-[.5px] my-1' />
        </>
    )

    const Member = showPreview
        ? <Preview
            user={previewData}
            onDelete={onDelete}
            onSave={onPromote}
            usePromotion={profileData.role === 'admin'}
            onInvite={onInvite}
            open={showPreview}
            onOpenChange={setShowPreview}
        />
        : null

    return (
        <div className='flex flex-col justify-center items-center'>
            <DropdownMenu.Root>
                <DropdownMenu.Trigger
                    className='
                        outline-1 
                        rounded-full
                        overflow-clip
                        size-8
                        outline-neutral-200 
                        flex 
                        justify-center 
                        items-center 
                        data-[state=open]:bg-amber-600 
                        hover:bg-amber-600 
                        data-[state=open]:text-light 
                        hover:text-light 
                        transition-opacity 
                        cursor-pointer
                    '
                >
                    {ProfilePicture || ProfileDefault}
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                    <DropdownMenu.Content
                        align='end'
                        sideOffset={10}
                        className='
                            text-sm 
                            font-semibold 
                            font-sans 
                            rounded-lg 
                            bg-light 
                            dark:bg-dark
                            ring-1 
                            ring-neutral-200 
                            p-1 
                            min-w-40
                            flex
                            flex-col
                            justify-center
                            *:cursor-pointer 
                            *:size-full
                            *:outline-transparent
                            *:data-highlighted:bg-amber-600
                            *:data-highlighted:text-light
                        '
                    >
                        <DropdownMenu.Item
                            onSelect={profile}
                            className='flex flex-col justify-center items-baseline px-4 py-2 outline-1 rounded-lg'
                        >
                            <span>Profile</span>
                            <span className='opacity-50 font-medium text-xs'>
                                {profileData.email}
                            </span>
                        </DropdownMenu.Item>
                        <DropdownMenu.Separator className='bg-neutral-200 py-[.5px] my-1' />
                        {(['admin', 'owner']).includes(user.role) ? Team : null}
                        <DropdownMenu.Item
                            onSelect={home}
                            className='flex justify-between items-center px-4 py-2 outline-1 rounded-lg'
                        >
                            Home
                        </DropdownMenu.Item>
                        <DropdownMenu.Item
                            onSelect={logout}
                            className='flex justify-between items-center px-4 py-2 outline-1 rounded-lg'
                        >
                            Logout
                        </DropdownMenu.Item>
                    </DropdownMenu.Content>
                </DropdownMenu.Portal>
            </DropdownMenu.Root>
            <Profile
                user={profileData}
                onSave={onSave}
                open={showProfile}
                onOpenChange={setShowProfile}
                onError={onError}
            />
            {Member}
            <Invite
                open={showInvite}
                onOpenChange={setShowInvite}
                onInvite={onInvite}
            />
            <Status
                status={status}
                setStatus={setStatus}
            />
        </div>
    )
}

export default Account