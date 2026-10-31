import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import '@/app/globals.css';
export const metadata:Metadata={title:{default:'Obidient Benue | Community & Public Information',template:'%s | Obidient Benue'},description:'Information about the Obidient Movement in Benue, the 2027 electoral candidates, public policy priorities and community registration.',robots:{index:true,follow:true},icons:{icon:'/favicon.svg'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body className="antialiased"><a href="#main-content" className="skip-link">Skip to content</a><Header/>{children}<Footer/></body></html>}
