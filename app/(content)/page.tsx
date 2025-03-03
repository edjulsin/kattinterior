import Image from "next/image";
import type { Metadata } from "next";
import Hero from '@/components/Hero';
import Works from '@/components/Works';
import Chaterina from '@/components/Chaterina';
import Bottom from '@/components/Bottom';
import Intro from '@/components/Intro';

export const metadata: Metadata = {
	title: "Katt Interior Design",
	description: 'Katt Interior is a Bali-based studio transforming visions into timeless spaces. We blend natural elements with thoughtful design to create environments that feel personal, meaningful, and lasting.',
}

export default () => (
	<>
		<Hero />
		<Works />
		<Intro />
		<Chaterina />
		<Bottom />
	</>
)
