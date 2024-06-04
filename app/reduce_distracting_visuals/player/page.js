'use client';

import { usePathname } from 'next/navigation';

export default function Page() {
    
  const pathname = usePathname();
  return (
        <div className="bg-black py-4 h-screen text-white text-center grid m-auto">
            <div className="pt-4">
                <a href="/" className="m-auto px-5 py-3">Home 🏠</a>
                <a href="/reduce_distracting_visuals/control" className="m-auto px-5 py-3 mx-3">Controls ⚙</a>
            </div>
            {pathname}
        </div>
    );
}