'use client'
import { signOut, useSession } from 'next-auth/react';
import Link from "next/link";
import SearchBar from "./searchbar";
export const Navbar = () => {
    const { data: session, status } = useSession()
    return (

        <div className="fixed top-0 left-0 w-full bg-white shadow-lg z-50">
            <div className="header flex w-[80%] justify-between m-auto pt-[20px] pb-[15px]">
                <div className="logo mr-10 mb-auto mt-auto text-2xl text-[#4EAC14]">
                    
                    <a href ='/'>GI Pineapple</a>
                    
                </div>

                <div className="search w-[500px]">
                    <SearchBar/>
                </div>
                <div className="menu mt-auto mb-auto ml-10">
                    <nav>
                        <ul className="menulist text-lg text-[#595959] flex gap-[40px]">
                            <li>
                                <Link href='/'>หน้าแรก</Link>
                            </li>
                            <li>
                                <Link href='/about'>เกี่ยวกับเรา</Link>
                            </li>
                            <li>
                                <Link href='/register'>สมัครสมาชิก</Link>
                            </li>
                            {status === 'unauthenticated' ? (
                            <li>
                            <Link href='/Login'>เข้าสู่ระบบ</Link>
                            </li>
                        ) : status === 'authenticated' && session?.user ? (
                            <>
                            <li>
                                <Link href='/profile'>โปรไฟล์</Link>
                            </li>
                            <li>
                            <button onClick={() => signOut({ callbackUrl: '/' })} >
                                    ออกจากระบบ
                            </button>
                                
                            </li>
                            </>

                            
                        ) : (
                            <li>Loading...</li>
                        )}
                        </ul>
                    </nav>
            
                </div>

            </div>
        </div>

    )


}
export default Navbar