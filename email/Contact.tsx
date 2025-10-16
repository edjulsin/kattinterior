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
    Column
} from '@react-email/components';

const development = process.env.NODE_ENV === 'development'
const url = development ? 'http://localhost:3000' : process.env.NEXT_PUBLIC_SITE_URL
const banner = `${url}/banner.png`

const Contact = ({ name, email, message }: { name: string, email: string, message: string }) =>
    <Html>
        <Head />
        <Preview>Contact from Katt</Preview>
        <Tailwind>
            <Body className="mx-auto my-auto bg-white px-2 font-sans">
                <Container className="mx-auto my-[40px] max-w-[465px] rounded border border-[#eaeaea] border-solid p-[30px]">
                    <Section>
                        <Img
                            src={ banner }
                            width="1200"
                            height="630"
                            alt="Katt"
                            className="mx-auto my-0 w-[200px] h-auto"
                        />
                    </Section>
                    <Heading className="mx-0 my-[30px] p-0 text-center font-normal text-[22px] text-neutral-800">
                        Contact from <strong>Katt</strong>
                    </Heading>
                    <Text className="text-[14px] text-neutral-500 leading-[24px]">
                        You've received a message through <strong>Katt's</strong> contact form.
                    </Text>
                    <Section className="text-neutral-500 leading-[24px]">
                        <Row className='my-[20px]'>
                            <Column>
                                <Text className='m-0 p-0 text-[12px] mb-[5px] text-neutral-400'>Name</Text>
                                <Text className='capitalize m-0 p-0 text-[14px]'>{ name }</Text>
                            </Column>
                        </Row>
                        <Row className='my-[20px]'>
                            <Column>
                                <Text className='m-0 p-0 text-[12px] mb-[5px] text-neutral-400'>Email</Text>
                                <Link className='m-0 p-0 underline text-[14px] leading-[24px]' href={ `mailto:${email}` }>{ email }</Link>
                            </Column>
                        </Row>
                        <Row className='my-[20px]'>
                            <Column>
                                <Text className='m-0 p-0 text-[12px] mb-[5px] text-neutral-400'>Message</Text>
                                <Text className='m-0 p-0 text-[14px]'>{ message }</Text>
                            </Column>
                        </Row>
                    </Section>
                    <br />
                    <Hr className="mx-0 my-[5px] w-full border border-[#eaeaea] border-solid" />
                    <Text className="text-neutral-400 text-[12px] leading-[24px]">
                        This is an automated message. Please reply directly to the sender's email.
                    </Text>
                </Container>
            </Body>
        </Tailwind>
    </Html>

export default Contact
