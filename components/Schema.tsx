import type { WithContext, Thing } from 'schema-dts'

const Schema = ({ value, children }: {
    value: WithContext<Thing>,
    children: React.ReactNode
}) =>
    <>
        <script
            type='application/ld+json'
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(value)
            }}
        />
        {children}
    </>

export default Schema