export type SchemaObject = Record<string, unknown>

const Schema = ({ value, children }: {
    value: SchemaObject,
    children: React.ReactNode
}) =>
    <>
        <script
            type='application/ld+json'
            dangerouslySetInnerHTML={ {
                __html: JSON.stringify(value)
            } }
        />
        { children }
    </>

export default Schema