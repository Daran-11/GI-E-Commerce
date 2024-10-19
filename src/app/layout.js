// app/layout.js or app/RootLayout.js
import { getServerSession } from 'next-auth';
import { Prompt } from 'next/font/google';
import SessionProvider from '../components/SessionProvider';
import './globals.css';
import PlausibleProvider from 'next-plausible';
import ClientLayout from '../components/ClientLayout'; // Import the ClientLayout

const prompt = Prompt({
  subsets: ['thai'],
  weight: ['300', '400'],
});

export default async function RootLayout({ children }) {
  const session = await getServerSession();

  return (
    <html lang="th">
      <head>
        <PlausibleProvider
          domain="gipineapple"
          trackLocalhost={true}
          enabled={true}
          taggedEvents={true}
        />
        <script src="https://cdn.omise.co/omise.js" defer></script>
      </head>
      <body className={`${prompt.className} bg-[#f1f1f1] m-0 p-0`}>
        <SessionProvider session={session}>
          <ClientLayout session={session}>{children}</ClientLayout>
        </SessionProvider>
      </body>
    </html>
  );
}
