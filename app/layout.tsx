import localFont from 'next/font/local'
import "./globals.css";
import type { Metadata } from 'next';

const serif = localFont({
	display: 'swap',
	src: '../assets/fonts/tanpearl/TanPearl.otf',
	weight: '400',
	variable: '--font-serif'
})

const sans = localFont({
	display: 'swap',
	src: '../assets/fonts/cabinet/Cabinet.woff2',
	variable: '--font-sans'
})

const development = process.env.NODE_ENV === 'development'
const url = development ? 'http://localhost:3000' : process.env.NEXT_PUBLIC_SITE_URL

export const metadata: Metadata = {
	metadataBase: new URL(url as string),
	referrer: 'strict-origin-when-cross-origin',
	pinterest: { richPin: true }
}

// apply challenge to protect login and contact
// register to search engine after domain purchased
const RootLayout = ({ children }: Readonly<{ children: React.ReactNode }>) =>
	<html lang='en'>
		<body
			className={`${serif.variable} ${sans.variable} antialiased flex flex-col justify-center items-center bg-light dark:bg-dark dark:text-white transition-colors duration-300 ease-in-out`}>
			{children}
		</body>
	</html>

export default RootLayout