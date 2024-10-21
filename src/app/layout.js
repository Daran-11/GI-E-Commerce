// src/app/layout.js
import { getServerSession } from 'next-auth';
import { Prompt } from 'next/font/google';
import SessionProvider from '../components/SessionProvider';
import './globals.css';
import PlausibleProvider from 'next-plausible';
import ClientLayout from '../components/ClientLayout';
import CookieConsentBanner from '@/components/CookieConsent';

const prompt = Prompt({
  subsets: ['thai'],
  weight: ['300', '400'],
});

export default async function RootLayout({ children }) {
  const session = await getServerSession();

  return (
    <html lang="th">
      <head>
        <script src="https://cdn.omise.co/omise.js" defer></script>
      </head>
      <body className={`${prompt.className} bg-[#f1f1f1] m-0 p-0`}>
        <SessionProvider session={session}>
          <PlausibleProvider
            domain="gipineapple" // Ensure this matches your actual production domain
            trackLocalhost={true} // Allows tracking while developing on localhost
            enabled={true}
            taggedEvents={true}
          >
            <ClientLayout session={session}>
              {children}
              <CookieConsentBanner />
            </ClientLayout>
          </PlausibleProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
