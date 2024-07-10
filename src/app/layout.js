
import { getServerSession } from 'next-auth';
import { Prompt } from "next/font/google";
import Navbar from "../components/navbar";
import SessionProvider from '../components/SessionProvider';
import "./globals.css";

const prompt = Prompt ({
    subsets: ['thai'],
    weight: '400',
});

// เป็น layout ที่จะใช้สำหรับทุกหน้า ทุกฟ้อนจะเปลี่ยนเมื่อมันอยู่ในตัว body กับ main ถ้าไม่ได้ครอบด้วย main ไว้ในหน้า page.js navbar ก็จะไม่ขึ้น
export default async function RootLayout({ children }) {
  const session = await getServerSession()
  return (
    
    <html lang="th">
      <body className={`${prompt.className} bg-[#fafafa]`}>
          <SessionProvider session={session}>
            <Navbar />
            <main>{children}</main>
          </SessionProvider>
      </body>
    </html>
  )
}
