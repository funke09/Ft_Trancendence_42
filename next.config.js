/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API_URL: process.env.API_URL || "https://api.example.com",
  },
};


module.exports = nextConfig