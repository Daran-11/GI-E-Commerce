import { Prompt } from "next/font/google";
import Navbar from "./components/navbar";
import "./globals.css";
const prompt = Prompt ({
    subsets: ['thai'],
    weight: '400',
});


export default function RootLayout({ children }) {
  return (
    
    <html lang="th">
        <body className={prompt.className}>
        <Navbar/>
        <main className={prompt.className}>{children}
                </main>
        </body>

    </html>
  );
}
