import type {Metadata} from 'next';
import {Header} from '@/components/layout/Header';
import {Footer} from '@/components/layout/Footer';
import '@/app/globals.css';
export const metadata:Metadata={title:{default:'Obidient Benue',template:'%s | Obidient Benue'},description:'Obidient Benue — community engagement, leadership profiles and development priorities.',robots:{index:true,follow:true},icons:{icon:'/brand/ndc-icon.webp'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body className="antialiased"><a href="#main-content" className="skip-link">Skip to content</a><Header/>{children}<Footer/></body></html>}
