import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Img,
    Preview,
    Section,
    Tailwind,
    Text,
    pixelBasedPreset
} from '@react-email/components';

const defaultConfirm = '{{ .SiteURL }}/auth/verify?token_hash={{ .TokenHash }}&type=email'
const defaultLogo = {
    src: '{{ .SiteURL }}/banner.png',
    width: 1200,
    height: 630,
    alt: 'Katt Interior'
}

const Confirmation = ({ confirm = defaultConfirm, logo = defaultLogo }: { confirm: string, logo: { src: string, width: number, height: number, alt: string } }) =>
    <Html>
        <Head />
        <Preview>Confirm your email to create your account on {logo.alt}.</Preview>
        <Tailwind config={{ presets: [pixelBasedPreset] }}>
            <Body className="bg-white font-sans p-5">
                <Container className="p-5 max-w-sm rounded-lg border-1 border-neutral-200">
                    <Img
                        src={logo.src}
                        width={logo.width}
                        height={logo.height}
                        alt={logo.alt}
                        className="m-auto w-50 h-auto"
                    />
                    <Heading className="text-center font-normal text-neutral-500 text-xl leading-normal">
                        Confirm Your Signup
                    </Heading>
                    <Section className='text-center'>
                        <Text className='text-left text-neutral-400 text-sm leading-normal'>
                            Click this button to confirm your account and login to {logo.alt}.
                        </Text>
                        <Button
                            className="rounded-lg my-5 bg-black px-4 py-2 font-semibold text-sm text-white no-underline leading-normal"
                            href={confirm}
                        >
                            Confirm
                        </Button>
                    </Section>
                    <Hr className="border-t-1 border-neutral-200" />
                    <Text className="text-neutral-400 text-xs leading-normal">
                        If you didn't try to login, you can safely ignore this email.
                    </Text>
                </Container>
            </Body>
        </Tailwind>
    </Html >

Confirmation.PreviewProps = {
    confirm: defaultConfirm,
    logo: { ...defaultLogo, src: '/static/banner.png' }
}

export default Confirmation
