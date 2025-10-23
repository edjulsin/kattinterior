import Guide from '@/components/Guide';
import image from '@/assets/6.png'
import pageSchema from '@/schemas/pageSchema';
import Schema from '@/components/Schema';
import Intersector from '@/components/Intersector';
import Parallax from '@/components/Parallax';
import pageMeta from '@/meta/page';

const meta = {
    title: 'Residential Interior Design',
    description: 'Professional residential interior design services for villas, apartments, and private homes in Bali. Designed to reflect your lifestyle and create a comfortable, personalized living space.',
    path: '/services/residential-design'
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
            title='Residential Design'
            description={[
                'Discover our interior packages to explore our services and pricing. We can also tailor a package to fit your needs',
                'Ready to get started? Contact us for a complimentary consultation, and let’s bring your dream interior to life!'
            ]}
            contentTitle='Our residential packages'
            contentList={[
                [
                    'Interior Interview',
                    'Get inspired with our Interior Interview—an in-depth brainstorming session where we explore your lifestyle, spaces, and design dreams, leaving you ready to transform your home.'
                ],
                [
                    'Interior Room Plan',
                    'Together, we reimagine your space with fresh colors, structural updates, and curated furniture—deciding what to keep and what to change for a perfect balance.'
                ],
                [
                    'Interior Floor Plan',
                    'If you want to redesign your space without reconstruction, this is the perfect plan. Whether updating a room or an entire home, we enhance walls, ceilings, and floors with color and structural changes.'
                ],
                [
                    '3D Construction Plan',
                    'With this plan, we redesign a floor or your entire home, carefully curating every detail to reflect your style and tell your story. The final design includes a 3D drawing for a clear vision of your new space.'
                ],
                [
                    'Development or Complete Renovation',
                    'With this package, we provide a complete architectural interior design plan, covering every detail from A to Z—ensuring nothing stands in the way of creating your extraordinary home.'
                ],
                [
                    'Exterior Plan',
                    'Whether its an estate, roof terrace, or urban garden, we seamlessly blend your indoor and outdoor spaces, creating a natural retreat that feels like home.'
                ],
                [
                    'Styling',
                    'At Katt Interior Design Studio, we curate furniture, lighting, and décor to transform your space into your dream home. Share your style, and we’ll handle the shopping and styling—so you can simply relax and enjoy your new interior.'
                ]
            ]}
            contactCopy='Package pricing details'
        />
    </Schema>


export default ResidentialPage