import Contact from '@/components/Contact'
import Intersector from '@/components/Intersector'
import Parallax from '@/components/Parallax'
import Schema from '@/components/Schema'
import pageMeta from '@/meta/page'
import pageSchema from '@/schemas/pageSchema'

const name = process.env.NEXT_PUBLIC_SITE_NAME as string

const meta = {
    title: 'Contact',
    description: `Get in touch with ${name} to start your interior design project in Bali. Reach out for consultations, inquiries, or collaborations. We’d love to hear from you.`,
    path: '/contact'
}

export const metadata = pageMeta(meta)

const ContactPage = () =>
    <Schema value={pageSchema(meta)}>
        <Intersector />
        <Parallax selectors={['.parallax']} />
        <section className='flex flex-col place-items-center gap-y-10 p-10'>
            <h1 className='text-center font-serif text-xl/loose full-slide-from-bottom'>Let’s build something amazing, together.</h1>
            <Contact />
        </section>
    </Schema>

export default ContactPage