import Guide from '@/components/Guide';
import image from '@/assets/6.png'
import pageSchema from '@/schemas/pageSchema';
import Schema from '@/components/Schema';
import Intersector from '@/components/Intersector';
import Parallax from '@/components/Parallax';
import pageMeta from '@/meta/page';

const name = process.env.NEXT_PUBLIC_SITE_NAME as string

const meta = {
    title: 'Interior Design Packages',
    description: `Professional interior design services for villas, apartments, and private homes in Bali by ${name}. Designed to reflect your lifestyle and create a comfortable, personalized living space.`,
    path: '/services/packages'
}

export const metadata = pageMeta(meta)

const ResidentialPage = () =>
    <Schema value={pageSchema(meta)}>
        <Intersector />
        <Parallax selectors={['.parallax']} />
        <Guide
            thumbnail={{
                src: image,
                alt: 'Villa Arunika by Chaterina',
                width: 1080,
                height: 1440
            }}
            title='Design Packages'
            description={[
                'Discover our interior packages to explore our services and pricing. We can also tailor a package to fit your needs',
                'Ready to get started? Contact us for a complimentary consultation, and let’s bring your dream interior to life!'
            ]}
            contentTitle='Our design packages'
            contentList={[
                [
                    'Discovery & Consultation',
                    'Every design begins with a conversation. We listen to your story, vision, and needs — defining the foundation for your project’s direction and design mood.'
                ],
                [
                    'Site Understanding',
                    'We study the space through site visits, photos, or existing drawings to understand proportion, natural light, and spatial flow.'
                ],
                [
                    'Concept Development',
                    'The creative foundation. We craft moodboards, layout plans, and material palettes that express your story through tone, texture, and atmosphere — balancing emotion with functionality.'
                ],
                [
                    'Design Development',
                    'The concept takes shape in 3D through SketchUp modeling. We refine the layout, ceiling, lighting, and material composition — creating a cohesive, practical, and visually inspiring design.'
                ],
                [
                    'Technical Drawings & Specifications',
                    'Once the 3D design is approved, we prepare detailed architectural and interior drawings to support accurate execution.'
                ],
                [
                    'Final Visualization (Render Stage)',
                    'We produce high-resolution renders based on the approved drawings and materials — capturing the design exactly as it will look in real life. These images are perfect for presentation, website portfolios, and Airbnb listings.'
                ],
                [
                    'Styling & Curation',
                    'The final touch that brings everything to life. We curate décor, art, and lighting that complete the story of your space — ensuring balance, warmth, and authenticity in every detail.'
                ],
                [
                    'Optional: Site Visit & Design Guidance',
                    'For clients who want design precision during implementation, we provide coordination visits or remote supervision — ensuring the result stays true to the original vision.'
                ]
            ]}
            contactCopy='Package pricing details'
        />
    </Schema>


export default ResidentialPage