
import { getAllContacts } from '@/action/server'
import Contacts from '@/components/Contacts'
import Error from '@/components/Error'
import Schema from '@/components/Schema'
import pageMeta from '@/meta/page'
import pageSchema from '@/schemas/pageSchema'
import { Metadata } from 'next'

const name = process.env.NEXT_PUBLIC_SITE_NAME
const meta = {
    title: 'Contacts',
    description: `View and search contact messages for ${name}`,
    path: '/dashboard/contacts'
}

export const metadata: Metadata = pageMeta(meta)

const ContactsDashboard = async () => getAllContacts(0, 20).then(
    contacts => <Contacts fetchCount={20} contacts={contacts} />,
    () => <Error title='Database Error' />
).then(content =>
    <Schema value={pageSchema(meta)}>
        {content}
    </Schema>
)

export default ContactsDashboard