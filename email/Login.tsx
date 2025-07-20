import { Body, Head, Html, Preview, Text, Container } from "@react-email/components";
import { render } from '@react-email/render';

export const Login = ({ name, email, message }: { name: string, email: string, message: string }) =>
    <Html lang='en'>
        <Head></Head>
        <Preview>{ message.slice(0, 60) }</Preview>
        <Body>
            <Container>
                <Text>Name: { name }</Text>
                <Text>Email: { email }</Text>
                <Text>Message: { message }</Text>
            </Container>
        </Body>
    </Html>

export const LoginPreview = ({ name, email, message }: { name: string, email: string, message: string }) =>
    render(
        <Login
            name={ name }
            email={ email }
            message={ message }
        />
    ).then(v =>
        <iframe
            srcDoc={ v }
        />
    )