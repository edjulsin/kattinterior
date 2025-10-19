import localFont from 'next/font/local'
import "./globals.css";
import type { Metadata } from 'next';

const serif = localFont({
	src: '../assets/fonts/tanpearl/TanPearl.otf',
	style: 'normal',
	weight: '400',
	variable: '--font-serif'
})

const sans = localFont({
	src: [
		{ path: '../assets/fonts/garamond/EBGaramond-ExtraBold.ttf', weight: '800', style: 'normal' },
		{ path: '../assets/fonts/garamond/EBGaramond-ExtraBold.ttf', weight: '800', style: 'italic' },
		{ path: '../assets/fonts/garamond/EBGaramond-Bold.ttf', weight: '700', style: 'normal' },
		{ path: '../assets/fonts/garamond/EBGaramond-BoldItalic.ttf', weight: '700', style: 'italic' },
		{ path: '../assets/fonts/garamond/EBGaramond-Medium.ttf', weight: '500', style: 'normal' },
		{ path: '../assets/fonts/garamond/EBGaramond-MediumItalic.ttf', weight: '500', style: 'italic' },
		{ path: '../assets/fonts/garamond/EBGaramond-Italic.ttf', weight: '400', style: 'italic' },
		{ path: '../assets/fonts/garamond/EBGaramond-Regular.ttf', weight: '400', style: 'normal' },
		{ path: '../assets/fonts/garamond/EBGaramond-SemiBold.ttf', weight: '600', style: 'normal' },
		{ path: '../assets/fonts/garamond/EBGaramond-SemiBoldItalic.ttf', weight: '600', style: 'italic' },
		{ path: '../assets/fonts/garamond/EBGaramond.otf', weight: '300', style: 'normal' }
	],
	variable: '--font-sans'
})

const development = process.env.NODE_ENV === 'development'
const name = process.env.NEXT_PUBLIC_SITE_NAME
const url = development ? 'http://localhost:3000' : process.env.NEXT_PUBLIC_SITE_URL

export const metadata: Metadata = {
	metadataBase: new URL(url as string),
	referrer: 'strict-origin-when-cross-origin',
	title: {
		default: `${name} | Interior Designer`,
		template: `%s | ${name}`
	},
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