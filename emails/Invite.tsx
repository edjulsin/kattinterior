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

const defaultConfirm = '{{ .SiteURL }}/auth/verify?token_hash={{ .TokenHash }}&type=invite'
const defaultLogo = {
    src: '{{ .SiteURL }}/banner.png',
    width: 1200,
    height: 630,
    alt: 'Katt Interior'
}

const Invite = ({ confirm = defaultConfirm, logo = defaultLogo }: { confirm: string, logo: { src: string, width: number, height: number, alt: string } }) =>
    <Html>
        <Head />
        <Preview>An invitation to join {logo.alt} has been sent to you.</Preview>
        <Tailwind config={{ presets: [pixelBasedPreset] }}>
            <Body className="m-0 p-5 bg-white font-sans">
                <Container className="p-5 max-w-sm rounded-lg border-1 border-neutral-200">
                    <Img
                        src={logo.src}
                        width={logo.width}
                        height={logo.height}
                        alt={logo.alt}
                        className="mx-auto my-0 w-50 h-auto"
                    />
                    <Heading className="text-center font-normal text-neutral-500 text-xl">
                        You Have Been Invited
                    </Heading>
                    <Section className='text-center'>
                        <Text className='text-left text-neutral-400 text-sm leading-normal'>
                            Click this button to create an account and login to {logo.alt}.
                        </Text>
                        <Button
                            className="rounded-lg bg-black px-4 py-2 my-5 text-center font-semibold text-sm text-white no-underline leading-normal"
                            href={confirm}
                        >
                            Accept
                        </Button>
                    </Section>
                    <Hr className="border-t-1 border-neutral-200" />
                    <Text className="text-neutral-400 text-xs leading-normal">
                        If you didn't know about this invitation, you can safely ignore this email.
                    </Text>
                </Container>
            </Body>
        </Tailwind>
    </Html>

Invite.PreviewProps = {
    confirm: defaultConfirm,
    logo: { ...defaultLogo, src: '/static/banner.png' }
}

export default Invite
