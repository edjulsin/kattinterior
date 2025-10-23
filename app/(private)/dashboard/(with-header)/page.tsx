import pageSchema from '@/schemas/pageSchema'
import { Metadata } from 'next'
import Dashboard from '@/components/Dashboard'
import Schema from '@/components/Schema'
import pageMeta from '@/meta/page'

const name = process.env.NEXT_PUBLIC_SITE_NAME
const meta = {
	title: 'Dashboard',
	description: `Manage all ${name} contents and contacts from the dashboard.`,
	path: '/dashboard'
}

export const metadata: Metadata = pageMeta(meta)

const DashboardPage = () =>
	<Schema value={pageSchema(meta)}>
		<Dashboard />
	</Schema>

export default DashboardPage

