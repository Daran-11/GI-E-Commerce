// src/app/layout.js
import CookieConsentBanner from '@/components/cookieConsent';
import DateProvider from '@/components/DateProvider';
import { getServerSession } from 'next-auth';
import PlausibleProvider from 'next-plausible';
import { Prompt } from 'next/font/google';
import { ToastContainer } from 'react-toastify'; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify styles
import ClientLayout from '../components/ClientLayout';
import SessionProvider from '../components/SessionProvider';
import { authOptions } from './api/auth/[...nextauth]/route';
import './globals.css';


const prompt = Prompt({
  subsets: ['thai'],
  weight: ['300', '400'],
});



export default async function RootLayout({ children }) {

  const session = await getServerSession(authOptions);


  return (
    <html lang="th">
      <head>
        <script src="https://cdn.omise.co/omise.js" defer></script>
        <script async src="https://plausible.io/js/plausible.js"></script>
      </head>
      <body className={`${prompt.className} bg-[#f1f1f1] m-0 p-0`}>
      <DateProvider>
        <SessionProvider session={session}>
          <PlausibleProvider
            domain="cri-gi-pineapple-851653706332.asia-southeast1.run.app" // Ensure this matches your actual production domain
            trackLocalhost={false} // Allows tracking while developing on localhost
            enabled={false}
            taggedEvents={true}
          >
            <ClientLayout session={session}>
              {children}
              <CookieConsentBanner />
              <ToastContainer
                position="top-right" // Keeps it on the top-right
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
              />

            </ClientLayout>
          </PlausibleProvider>
        </SessionProvider>
        </DateProvider>
      </body>
    </html>
  );
}
