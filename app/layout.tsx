import type { Metadata } from "next";
import localFont from 'next/font/local'
import "./globals.css";

const serif = localFont({
	src: '../public/fonts/tanpearl/TanPearl.otf',
	style: 'normal',
	weight: '400',
	variable: '--font-serif',
	display: 'swap'
})

const sans = localFont({
	src: [
		{ path: '../public/fonts/garamond/EBGaramond-ExtraBold.ttf', weight: '800', style: 'normal' },
		{ path: '../public/fonts/garamond/EBGaramond-ExtraBold.ttf', weight: '800', style: 'italic' },
		{ path: '../public/fonts/garamond/EBGaramond-Bold.ttf', weight: '700', style: 'normal' },
		{ path: '../public/fonts/garamond/EBGaramond-BoldItalic.ttf', weight: '700', style: 'italic' },
		{ path: '../public/fonts/garamond/EBGaramond-Medium.ttf', weight: '500', style: 'normal' },
		{ path: '../public/fonts/garamond/EBGaramond-MediumItalic.ttf', weight: '500', style: 'italic' },
		{ path: '../public/fonts/garamond/EBGaramond-Italic.ttf', weight: '400', style: 'italic' },
		{ path: '../public/fonts/garamond/EBGaramond-Regular.ttf', weight: '400', style: 'normal' },
		{ path: '../public/fonts/garamond/EBGaramond-SemiBold.ttf', weight: '600', style: 'normal' },
		{ path: '../public/fonts/garamond/EBGaramond-SemiBoldItalic.ttf', weight: '600', style: 'italic' },
		{ path: '../public/fonts/garamond/EBGaramond.otf', weight: '300', style: 'normal' }
	],
	variable: '--font-sans',
	display: 'swap'
})

export default ({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) => (
	<html lang='en'>
		<body className={ `${serif.variable} ${sans.variable} antialiased` }>
			{ children }
		</body>
	</html>
)