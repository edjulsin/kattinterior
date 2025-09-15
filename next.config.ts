import type { NextConfig } from "next"

const env = process.env.NODE_ENV === 'development'
const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL
const bucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET

const CSP = `
	default-src 'self';
	script-src 'self' ${env ? "'unsafe-eval' 'unsafe-inline'" : ''};
	style-src 'self' ${env ? "'unsafe-inline'" : ''};
	img-src 'self' blob: data: ${supabase};
	connect-src 'self' ${supabase};
	font-src 'self';
	object-src 'none';
	base-uri 'self';
	form-action 'self';
	frame-ancestors 'none';
	upgrade-insecure-requests;
`.replace(/\n/g, '')

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			new URL(`${supabase}/storage/v1/object/public/${bucket}/**`)
		]
	},
	async headers() {
		return [
			{
				source: '/(.*)',
				headers: [
					{
						key: 'Content-Security-Policy',
						value: CSP
					}
				]
			}
		]
	}
}

export default nextConfig
