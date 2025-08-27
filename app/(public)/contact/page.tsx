import Contact from '@/components/Contact'
import Intersector from '@/components/Intersector'
import Parallax from '@/components/Parallax'
import Schema from '@/components/Schema'
import pageSchema from '@/schemas/pageSchema'

export const metadata = {
    title: 'Contact us',
    description: 'Get in touch with Katt Interior Studio to start your interior design project in Bali. Reach out for consultations, inquiries, or collaborations. We’d love to hear from you.',
    alternates: {
        canonical: '/contact'
    }
}

const ContactPage = () =>
    <Schema
        value={
            pageSchema({
                path: '/contact',
                description: metadata.description as string
            })
        }
    >
        <Intersector />
        <Parallax selectors={ [ '.parallax' ] } />
        <section className='flex flex-col place-items-center gap-y-10 p-10'>
            <h1 className='text-center font-serif text-xl/loose full-slide-from-bottom'>Let’s build something amazing, together.</h1>
            <Contact />
        </section>
    </Schema>

export default ContactPage