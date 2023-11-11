/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["avatars.githubusercontent.com", "lh3.googleusercontent.com","saunvid-twitter-dev.s3.us-west-1.amazonaws.com"],
  },
};

module.exports = nextConfig;
