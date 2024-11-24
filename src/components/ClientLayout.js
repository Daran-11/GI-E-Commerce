"use client";

import { CartProvider } from '@/context/cartContext';
import { usePathname } from 'next/navigation';
import Footer from './Footer';
import NavbarWrapper from './NavbarWrapper';


export default function ClientLayout({ session, children }) {
    const pathname = usePathname();
    // Specify a path prefix or pattern where the Footer should be hidden
    const shouldHideFooter = pathname.startsWith('/admin-dashboard') || pathname.startsWith('/dashboard') || pathname.startsWith('/cart') || pathname.startsWith('/municipality-dashboard');

    return (
        <CartProvider>
            <NavbarWrapper>
                <main className="m-0">{children}</main>
                {!shouldHideFooter && <Footer/>}
            </NavbarWrapper>
        </CartProvider>
    );
}
