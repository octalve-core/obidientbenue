import { notFound } from 'next/navigation';
export default function Events(){if(process.env.NEXT_PUBLIC_SHOW_EVENTS!=='true')notFound();return <main id="main-content" className="container-shell py-24"><h1 className="text-4xl font-medium">Events</h1><p className="mt-4 text-slate-600">Confirmed event details will appear here.</p></main>}
