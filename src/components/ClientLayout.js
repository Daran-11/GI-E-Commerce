
"use client";

import { useEffect, useState } from 'react';
import { CartProvider } from '@/context/cartContext';
import NavbarWrapper from './NavbarWrapper';
import Footer from './Footer';
import { usePathname } from 'next/navigation';

export default function ClientLayout({ session, children }) {
    const pathname = usePathname();
    // Specify a path prefix or pattern where the Footer should be hidden
    const shouldHideFooter = pathname.startsWith('/admin-dashboard') || pathname.startsWith('/dashboard');

    return (
        <CartProvider>
            <NavbarWrapper>
                <main className="m-0">{children}</main>
                {!shouldHideFooter && <Footer />}
            </NavbarWrapper>
        </CartProvider>
    );
}
