import { useDropzone } from 'react-dropzone'

export default ({
    children,
    className = '',
    onDrop,
    noDragsEventBubbling = false,
    noClick = false
}: {
    children: React.ReactNode,
    className?:
    string,
    onDrop: Function,
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
