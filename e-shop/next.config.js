/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
              protocol: "https",
              hostname: "*.googleusercontent.com",
              port: "",
              pathname: "**",
            },
            {
                protocol: "https",
                hostname: "*.media-amazon.com",
                port: "",
                pathname: "**",
            },
          ],
    }
}

module.exports = nextConfig
