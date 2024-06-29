'use client';

import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react';
import { signOut, useSession } from 'next-auth/react';
import Link from "next/link";
import '../../lib/fontAwesome';
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
                        <ul className="menulist text-lg text-[#595959] flex xl:gap-x-[40px] md:gap-x-[20px]">
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
                            <Dropdown
                                showArrow ='true'
                            >
                                <DropdownTrigger>
                                    <Button 
                                    variant="bordered" 
                                    disableRipple="true"
                                    >
                                            <svg className='fill-current hover:text-[#4EAC14]'
                                             xmlns="http://www.w3.org/2000/svg" 
                                             height="30px" viewBox="0 -960 960 960" 
                                             width="30px" fill="#595959">
                                                <path d="M170-254.62q-12.75 0-21.37-8.63-8.63-8.62-8.63-21.38 0-12.75 8.63-21.37 8.62-8.61 21.37-8.61h620q12.75 0 21.37 8.62 8.63 8.63 8.63 21.39 0 12.75-8.63 21.37-8.62 8.61-21.37 8.61H170ZM170-450q-12.75 0-21.37-8.63-8.63-8.63-8.63-21.38 0-12.76 8.63-21.37Q157.25-510 170-510h620q12.75 0 21.37 8.63 8.63 8.63 8.63 21.38 0 12.76-8.63 21.37Q802.75-450 790-450H170Zm0-195.39q-12.75 0-21.37-8.62-8.63-8.63-8.63-21.39 0-12.75 8.63-21.37 8.62-8.61 21.37-8.61h620q12.75 0 21.37 8.63 8.63 8.62 8.63 21.38 0 12.75-8.63 21.37-8.62 8.61-21.37 8.61H170Z"/>
                                            </svg>

                                   
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu 
                                    aria-label="Static Actions"
                                    className='pt-10 w-[300px] h-[500px] bg-white border shadow-lg rounded-lg flex-auto '
                                >
                                    <DropdownItem key="profile" className='dropdown-item textValue="โปรไฟล์" ' href='/profile'>
                                            บัญชีผู้ใช้
                                    </DropdownItem>

                                    <DropdownItem key="farmer register " className='dropdown-item' textValue="ลงทะเบียนเกษตรกร" href='/about'>
                                            ลงทะเบียนเกษตรกร
                                    </DropdownItem>   
                                    
                                    <DropdownItem key="signout" className='dropdown-item text-red-500 hover:text-red-500' textValue="ออกจากระบบ">
                                        <button onClick={() => signOut({ callbackUrl: '/' })}>
                                            ออกจากระบบ
                                        </button>
                                    </DropdownItem>
                                    
                                </DropdownMenu>
                                </Dropdown>
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