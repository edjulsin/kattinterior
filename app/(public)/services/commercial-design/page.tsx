import Guide from '@/components/Guide';
import image from '@/assets/6.png'
import pageSchema from '@/schemas/pageSchema';
import Schema from '@/components/Schema';
import Intersector from '@/components/Intersector';
import Parallax from '@/components/Parallax';
import pageMeta from '@/meta/page';

const meta = {
    title: 'Commercial Interior Design',
    description: 'Create impactful and functional spaces for your business with Katt Interior Studio’s Commercial Design Package. Specialized interior design for retail, office, hospitality, and more in Bali.',
    path: '/services/commercial-design'
}

export const metadata = pageMeta(meta)

const CommercialPage = () =>
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
            title='Commercial Design'
            description={[
                'Discover our interior packages to explore our services and pricing. We can also tailor a package to fit your needs.',
                'Ready to get started? Contact us for a complimentary consultation, and let’s bring your dream interior to life!'
            ]}
            contentTitle='Our commercial code'
            contentList={[
                [
                    'Critical Call',
                    'Here, we discuss your vision and budget—the first step toward a standout brand interior.'
                ],
                [
                    'Company Crunch',
                    'We research your brand, market, and audience to define the right direction for your interior.'
                ],
                [
                    'Complexity',
                    'A dynamic 4-hour session to explore your values, goals, and customer journey, shaping them into a functional interior.'
                ],
                [
                    'Clarity',
                    'We refine interior concepts based on data, aligning them with your vision and space.'
                ],
                [
                    'Conclusion',
                    'We present the style and layout that align with your vision and customer journey.'
                ],
                [
                    'Countour',
                    'This is where we meet and discuss your interior wishes and budget. This is the start of your leading brand interior.'
                ],
                [
                    'Concept',
                    'We define the atmosphere, colors, materials, and furniture, bringing the concept to life.'
                ],
                [
                    'Creativity',
                    'We bring your business interior to life with 3D designs and realistic renders, letting you visualize your dream space.'
                ],
                [
                    'Completion',
                    'We finalize materials, furniture, and custom elements within budget, refining the 3D plan for confident execution.'
                ],
                [
                    'Construction',
                    'Based on our agreement, we coordinate all parties and begin bringing your interior concept to life.'
                ],
                [
                    'Creation',
                    'We perfect your interior with full-service styling, down to the finest details.'
                ]
            ]}
            contactCopy='For more details'
        />
    </Schema>

export default CommercialPage