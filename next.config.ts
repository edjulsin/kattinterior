import type { NextConfig } from "next"

const development = process.env.NODE_ENV === 'development'
const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL

const CSP = `
	default-src 'self';
	script-src 'self' 'unsafe-eval' 'unsafe-inline';
	style-src 'self' 'unsafe-inline';
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
		dangerouslyAllowLocalIP: development,
		remotePatterns: [
			new URL(`${supabase}/storage/v1/object/public/${process.env.NEXT_PUBLIC_SUPABASE_BUCKET_PROJECTS}/**`),
			new URL(`${supabase}/storage/v1/object/public/${process.env.NEXT_PUBLIC_SUPABASE_BUCKET_AVATARS}/**`)
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
