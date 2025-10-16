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

const Login = ({ confirm, logo }: { confirm: string, logo: string }) =>
    <Html>
        <Head />
        <Preview>Login to Katt</Preview>
        <Tailwind>
            <Body className="mx-auto my-auto bg-white px-2 font-sans">
                <Container className="mx-auto my-[40px] max-w-[465px] rounded border border-[#eaeaea] border-solid p-[30px]">
                    <Section>
                        <Img
                            src={ logo }
                            width="1200"
                            height="630"
                            alt="Katt"
                            className="mx-auto my-0 w-[200px] h-auto"
                        />
                    </Section>
                    <Heading className="mx-0 my-[30px] p-0 text-center font-normal text-[24px] text-black">
                        Login to <strong>Katt</strong>
                    </Heading>
                    <Text className="text-[14px] leading-[24px] text-neutral-500">
                        Click one of the options below to login to <strong>Katt's</strong> dashboard.
                    </Text>
                    <Section className="mt-[32px] mb-[16px] text-center">
                        <Button
                            className="rounded bg-black px-4 py-2 text-center font-semibold text-[12px] text-white no-underline"
                            href={ confirm }
                        >
                            Dashboard
                        </Button>
                    </Section>
                    <Text className='text-center text-[14px] leading-[24px] text-neutral-400'>or</Text>
                    <Text className="text-[14px] text-blue-500 leading-[24px] text-center">
                        <Link href={ confirm } className="underline">
                            Magic link
                        </Link>
                    </Text>
                    <br />
                    <Hr className="mx-0 my-[26px] w-full border border-[#eaeaea] border-solid" />
                    <Text className="text-neutral-400 text-[12px] leading-[24px]">
                        If you didn't try to login, you can safely ignore this email.
                    </Text>
                </Container>
            </Body>
        </Tailwind>
    </Html>


export default Login
