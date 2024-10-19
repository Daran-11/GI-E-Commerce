// components/NavbarWrapper.js
"use client";

import Navbar from './navbar';
import { usePathname } from 'next/navigation';

export default function NavbarWrapper({ children }) {
    const pathname = usePathname();

    // Specify a path prefix or pattern where the Navbar should be hidden
    const shouldHideNavbar = pathname.startsWith('/dashboard-admin');

    return (
        <>
            {!shouldHideNavbar && <Navbar />}
            <main className={`transition-all duration-300 ${shouldHideNavbar ? 'mt-0' : 'mt-4'}`}>
                {children}
            </main>
        </>
    );
}
