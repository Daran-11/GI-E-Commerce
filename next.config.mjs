/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
      NEXT_PUBLIC_OMISE_PUBLIC_KEY: process.env.NEXT_PUBLIC_OMISE_PUBLIC_KEY,
    },
  };

export default nextConfig;
