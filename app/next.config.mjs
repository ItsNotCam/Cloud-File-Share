/* @type {import('next').NextConfig}


const nextConfig = {
	experimental: {
		serverActions: true,
  },
};

// module.exports = nextConfig
export default nextConfig;*/

/** @type {import('next').NextConfig} */

// TEMPORARY
import dotenv from 'dotenv';
// const dotenv = require('dotenv');
dotenv.config({path: '../.env'})

const nextConfig = {}

export default nextConfig;