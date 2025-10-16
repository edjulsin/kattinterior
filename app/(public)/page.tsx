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

const name = process.env.NEXT_PUBLIC_SITE_NAME

export const metadata: Metadata = {
	description: `Discover professional interior design solutions in Bali with ${name}. Residential, commercial, and custom projects.`,
	alternates: {
		canonical: '/'
	}
}

const HomePage = () =>
	<Schema
		value={
			pageSchema({
				path: '/',
				description: metadata.description as string
			})
		}
	>
		<Intersector />
		<Parallax selectors={ [ '.parallax' ] } />
		<Hero />
		<Work />
		<Intro />
		<Chaterina />
		<Bottom />
	</Schema>

export default HomePage
