import {
    Body,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Img,
    Link,
    Preview,
    Section,
    Tailwind,
    Text,
    Row,
    Column,
    pixelBasedPreset
} from '@react-email/components';

const siteName = process.env.NEXT_PUBLIC_SITE_NAME as string
const siteURL = process.env.NEXT_PUBLIC_SITE_URL as string

const defaultName = 'Edwin'
const defaultemail = 'edjulsin@mail.com'
const defaultMessage = 'Hey there!'
const defaultLogo = {
    src: `${siteURL}/banner.png`,
    width: 1200,
    height: 630,
    alt: siteName
}

const Contact = ({ logo = defaultLogo, name = defaultName, email = defaultemail, message = defaultMessage }: { name: string, email: string, message: string, logo: { src: string, width: number, height: number, alt: string } }) =>
    <Html>
        <Head />
        <Preview className='capitalize'>You’ve received a new message from {siteName}. View the contact form details.</Preview>
        <Tailwind config={{ presets: [pixelBasedPreset] }}>
            <Body className="m-0 p-5 bg-white font-sans">
                <Container className="p-5 max-w-sm rounded-lg border-1 border-neutral-200 text-sm text-neutral-500">
                    <Img
                        src={logo.src}
                        width={logo.width}
                        height={logo.height}
                        alt={logo.alt}
                        className="m-auto w-50 h-auto"
                    />
                    <Heading className="text-center font-normal text-neutral-500 text-xl">
                        Contact Form
                    </Heading>
                    <Section>
                        <Row className='my-5'>
                            <Column>
                                <Text className='m-0 p-0 text-xs text-neutral-400'>Name</Text>
                                <Text className='capitalize m-0 p-0 text-base'>{name}</Text>
                            </Column>
                        </Row>
                        <Row className='my-5'>
                            <Column>
                                <Text className='m-0 p-0 text-xs text-neutral-400'>Email</Text>
                                <Link className='m-0 p-0 underline text-base leading-[24px]' href={`mailto:${email}`}>{email}</Link>
                            </Column>
                        </Row>
                        <Row className='my-5'>
                            <Column>
                                <Text className='m-0 p-0 text-xs text-neutral-400'>Message</Text>
                                <Text className='m-0 p-0 text-base'>{message}</Text>
                            </Column>
                        </Row>
                    </Section>
                    <Hr className="bordert-t-1 border-neutral-200" />
                    <Text className="text-neutral-400 text-xs leading-normal">
                        This is an automated message. Please reply directly to the sender's email.
                    </Text>
                </Container>
            </Body>
        </Tailwind>
    </Html>

Contact.PreviewProps = {
    name: defaultName,
    email: defaultemail,
    message: defaultMessage,
    logo: { ...defaultLogo, src: '/static/banner.png', alt: 'Katt Interior' }
}

export default Contact
