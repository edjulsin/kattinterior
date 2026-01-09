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

const Magic = ({ confirm = defaultConfirm, logo = defaultLogo }: { confirm: string, logo: { src: string, width: number, height: number, alt: string } }) =>
    <Html>
        <Head />
        <Preview>Use this secure link to sign in to {logo.alt}.</Preview>
        <Tailwind config={{ presets: [pixelBasedPreset] }}>
            <Body className="m-0 p-5 bg-white font-sans">
                <Container className="p-5 size-full max-w-sm rounded-lg border-1 border-neutral-200">
                    <Img
                        src={logo.src}
                        width={logo.width}
                        height={logo.height}
                        alt={logo.alt}
                        className="m-auto w-50 h-auto"
                    />
                    <Heading className="text-center font-normal text-neutral-500 text-xl leading-normal">
                        Your Magic Link
                    </Heading>
                    <Section className='text-center'>
                        <Text className='text-left text-neutral-400 text-sm leading-normal'>
                            Click this button to login to {logo.alt}.
                        </Text>
                        <Button
                            className="rounded-lg bg-black px-4 py-2 my-5 text-center font-semibold text-sm text-white no-underline leading-normal"
                            href={confirm}
                        >
                            Log In
                        </Button>
                    </Section>
                    <Hr className="border-t-1 border-neutral-200" />
                    <Text className="text-neutral-400 text-xs leading-normal">
                        If you didn't try to login, you can safely ignore this email.
                    </Text>
                </Container>
            </Body>
        </Tailwind>
    </Html>

Magic.PreviewProps = {
    confirm: defaultConfirm,
    logo: { ...defaultLogo, src: '/static/banner.png' }
}

export default Magic
