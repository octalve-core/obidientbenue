import { notFound } from 'next/navigation';
export default function News(){if(process.env.NEXT_PUBLIC_SHOW_NEWS!=='true')notFound();return <main id="main-content" className="container-shell py-24"><h1 className="text-4xl font-medium">Updates</h1><p className="mt-4 text-slate-600">Verified public updates will appear here.</p></main>}
