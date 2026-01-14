import { useDropzone } from 'react-dropzone'

const Droppable = ({
    children,
    id,
    className = '',
    onDrop,
    noDragsEventBubbling = false,
    noClick = false,
    autoFocus = false
}: {
    children: React.ReactNode,
    id?: string,
    className?: string,
    onDrop: (files: File[]) => any,
    noDragsEventBubbling?: boolean,
    noClick?: boolean,
    autoFocus?: boolean
}) => {
    const { getRootProps, getInputProps } = useDropzone({
        accept: { 'image/*': [] },
        onDrop: files => onDrop(files),
        noDragEventsBubbling: noDragsEventBubbling,
        noClick: noClick,
        autoFocus: autoFocus
    })
    const props = Object.fromEntries(
        Object.entries({ id, className }).filter(([_, v]) => v)
    )
    return (
        <div {...getRootProps(props)}>
            <input {...getInputProps()} />
            {children}
        </div>
    )
}

export default Droppable
