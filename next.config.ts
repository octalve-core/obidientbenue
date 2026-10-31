import type { NextConfig } from 'next';
const nextConfig: NextConfig = {
  reactStrictMode: true,
  async headers(){return [
    { source:'/:path*',headers:[
      {key:'X-Content-Type-Options',value:'nosniff'},
      {key:'Referrer-Policy',value:'strict-origin-when-cross-origin'},
      {key:'Permissions-Policy',value:'camera=(), microphone=(), geolocation=()'},
      {key:'X-Frame-Options',value:'DENY'}
    ]},
    { source:'/api/:path*',headers:[{key:'Cache-Control',value:'no-store'}]},
  ];}
};
export default nextConfig;
