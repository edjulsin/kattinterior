
import { getAllContacts } from '@/action/server'
import Contacts from '@/components/Contacts'
import Error from '@/components/Error'
import Schema from '@/components/Schema'
import pageSchema from '@/schemas/pageSchema'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Contacts',
    description: `View and search contact messages for ${process.env.NEXT_PUBLIC_SITE_NAME}`,
    alternates: {
        canonical: '/dashboard/contacts'
    }
}

const ContactsDashboard = async () => getAllContacts(0, 20).then(
    contacts => <Contacts fetchCount={ 20 } contacts={ contacts } />,
    () => <Error title='Database Error' />
).then(content =>
    <Schema
        value={
            pageSchema({
                path: metadata.alternates?.canonical as string,
                description: metadata.description as string
            })
        }
    >
        { content }
    </Schema>
)

export default ContactsDashboard