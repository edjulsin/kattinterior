import localFont from 'next/font/local'
import "./globals.css";
import clsx from 'clsx';

const serif = localFont({
	src: '../public/fonts/tanpearl/TanPearl.otf',
	style: 'normal',
	weight: '400',
	variable: '--font-serif',
	preload: false
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
	preload: false
})

export default ({ children }: Readonly<{ children: React.ReactNode }>) =>
	<html lang='en'>
		<body
			className={
				clsx(`${serif.variable} ${sans.variable} antialiased flex flex-col justify-center items-center`, 'bg-light dark:bg-dark dark:text-white')
			}>
			{ children }
		</body>
	</html>