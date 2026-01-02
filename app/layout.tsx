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

const url = process.env.NEXT_PUBLIC_SITE_URL as string

export const metadata: Metadata = {
	metadataBase: new URL(url as string),
	referrer: 'strict-origin-when-cross-origin',
	pinterest: { richPin: true }
}

// apply challenge to protect login and contact
// register to search engine after domain purchased
const Layout = ({ children }: Readonly<{ children: React.ReactNode }>) =>
	<html lang='en'>
		<body
			className={`${serif.variable} ${sans.variable} antialiased flex flex-col justify-center items-center bg-light text-font-dark dark:bg-dark dark:text-font-light transition-colors duration-300 ease-in-out`}>
			{children}
		</body>
	</html>

export default Layout