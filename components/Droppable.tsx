import { useDropzone } from 'react-dropzone'

const Droppable = ({
    children,
    className = '',
    onDrop,
    noDragsEventBubbling = false,
    noClick = false
}: {
    children: React.ReactNode,
    className?:
    string,
    onDrop: (files: File[]) => Promise<void>,
    noDragsEventBubbling?: boolean,
    noClick?: boolean
}) => {
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

export default Droppable
