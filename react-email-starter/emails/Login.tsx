import {
    Body,
    Button,
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
} from '@react-email/components';


export const Login = ({ link }: { link: string }) => (
    <Html>
        <Head />
        <Preview>Login to Katt</Preview>
        <Tailwind>
            <Body className="mx-auto my-auto bg-white px-2 font-sans">
                <Container className="mx-auto my-[40px] max-w-[465px] rounded border border-[#eaeaea] border-solid p-[20px]">
                    <Section className="mt-[32px]">
                        <Img
                            src={ `/static/text-logo.png` }
                            width="519"
                            height="241"
                            alt="Katt"
                            className="mx-auto my-0 w-[75px] h-auto"
                        />
                    </Section>
                    <Heading className="mx-0 my-[30px] p-0 text-center font-normal text-[24px] text-black">
                        Login to <strong>Katt</strong>
                    </Heading>
                    <Text className="text-[14px] text-black leading-[24px] text-center">
                        Click to login into Katt dashboard.
                    </Text>
                    <Section className="mt-[32px] mb-[16px] text-center">
                        <Button
                            className="rounded bg-[#000000] px-5 py-3 text-center font-semibold text-[12px] text-white no-underline"
                            href={ link }
                        >
                            Dashboard
                        </Button>
                    </Section>
                    <Text className='text-center text-[14px] text-black leading-[24px]'>or</Text>
                    <Text className="text-[14px] text-black leading-[24px] text-center">
                        <Link href={ link } className="text-blue-600 no-underline">
                            Magic link
                        </Link>
                    </Text>
                    <Hr className="mx-0 my-[26px] w-full border border-[#eaeaea] border-solid" />
                    <Text className="text-[#666666] text-[12px] leading-[24px]">
                        If you didn't try to login, you can safely ignore this email.
                    </Text>
                </Container>
            </Body>
        </Tailwind>
    </Html>
)

Login.PreviewProps = { link: 'replace me' }

export default Login;
