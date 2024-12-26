// components/NavbarWrapper.js
"use client";

import { usePathname } from 'next/navigation';
import Navbar from './navbar';

export default function NavbarWrapper({ session , children }) {
    const pathname = usePathname();
    // Specify a path prefix or pattern where the Navbar should be hidden
    const shouldHideNavbar = pathname.startsWith('/dashboard-admin');

    return (
        <>
            {!shouldHideNavbar && <Navbar session={session}/>}
            <main className={`transition-all duration-300 ${shouldHideNavbar ? 'mt-0' : 'mt-4'}`}>
                {children}
            </main>
        </>
    );
}
