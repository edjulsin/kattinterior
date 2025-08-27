import pageSchema from '@/schemas/pageSchema'
import { Metadata } from 'next'
import Dashboard from '@/components/Dashboard'
import Schema from '@/components/Schema'

export const metadata: Metadata = {
	title: 'Dashboard',
	description: `Manage all ${process.env.NEXT_PUBLIC_SITE_NAME} contents and contacts from the dashboard.`,
	alternates: {
		canonical: '/dashboard'
	}
}

const DashboardPage = () =>
	<Schema
		value={
			pageSchema({
				path: metadata.alternates?.canonical as string,
				description: metadata.description as string
			})
		}
	>
		<Dashboard />
	</Schema>

export default DashboardPage

