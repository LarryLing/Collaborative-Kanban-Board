import type { NextConfig } from "next"

const nextConfig: NextConfig = {
	experimental: {
		serverActions: {
			bodySizeLimit: "6mb",
		},
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "images.unsplash.com",
				port: "",
				pathname: "/*",
				search: "",
			},
		],
	},
}

export default nextConfig
