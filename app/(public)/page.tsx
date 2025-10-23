import type { Metadata } from "next";
import Bottom from '@/components/Bottom';
import Chaterina from '@/components/Chaterina';
import Hero from '@/components/Hero';
import Intro from '@/components/Intro';
import Work from '@/components/Work';
import pageSchema from '@/schemas/pageSchema';
import Schema from "@/components/Schema";
import Intersector from '@/components/Intersector';
import Parallax from '@/components/Parallax';
import pageMeta from '@/meta/page';

const name = process.env.NEXT_PUBLIC_SITE_NAME as string
const meta = {
	title: name,
	description: `Discover professional interior design solutions in Bali with ${name}. Residential, commercial, and custom projects.`,
	path: '/'
}

export const dynamic = 'force-static'

export const metadata: Metadata = pageMeta(meta)

const HomePage = () =>
	<Schema value={pageSchema(meta)}>
		<Intersector />
		<Parallax selectors={['.parallax']} />
		<Hero />
		<Work />
		<Intro />
		<Chaterina />
		<Bottom />
	</Schema>

export default HomePage
