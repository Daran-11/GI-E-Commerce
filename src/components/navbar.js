'use client';
import { useCart } from '@/context/cartContext';
import { Button, Dropdown, DropdownItem, DropdownMenu, PopoverTrigger } from '@nextui-org/react';
import { signOut, useSession } from 'next-auth/react';
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import SearchBar from "./searchbar";

export const Navbar = () => {
    const { data: session, status } = useSession();
    const currentPath = usePathname();
    const { cartItemCount } = useCart();
    const activePaths = ['/account/user/profile', '/account/user/settings', '/account/user/orders', '/account/user/addresses'];

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const toggleButtonRef = useRef(null);
    const [menuAnimation, setMenuAnimation] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current && !dropdownRef.current.contains(event.target) &&
                toggleButtonRef.current && !toggleButtonRef.current.contains(event.target)
            ) {
                toggleMenu();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [dropdownRef, toggleMenu]);

    useEffect(() => {
        if (isMenuOpen) {
            setMenuAnimation(true);
        } else {
            setMenuAnimation(false);
        }
    }, [isMenuOpen]);

    // Do not return null; instead, conditionally render the navbar content
    if (currentPath.startsWith('/dashboard') || currentPath.startsWith('/admin-dashboard')) {
        return null; // Render nothing if the path starts with these values
    }

    return (
        <div className="fixed top-0 left-0 w-full bg-white shadow-lg z-50">
            <div className='md:hidden w-[95%] m-auto mt-[5px] text-[#4EAC14] flex justify-center '>
                <a className='text-start' href='/'>GI Pineapple Chiang Rai</a>
            </div>

            <div className="header flex gap-x-5 md:gap-x-0 w-[95%] 2xl:w-[80%] justify-between m-auto pt-[5px] md:pt-[20px] pb-[15px]">


                <div className='hidden md:flex items-center'>
                    <div className=" lg:w-[150px]  xl:w-[200px] lg:pl-4 text-lg w-fit sm:text-xl xl:text-2xl text-[#4EAC14]">
                        <a href='/'>GI Pineapple</a>
                    </div>
                </div>

                <div className="md:ml-2 w-full 2xl:w-[650px] xl:w-[500px] lg:w-[400px] md:w-[600px]">
                    <SearchBar />
                </div>


                {/* Hamburger Icon */}
                <div ref={toggleButtonRef} className="lg:hidden flex items-center">
                    <button onClick={toggleMenu}>
                        <svg className="w-6 h-6 text-[#595959]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                        </svg>
                    </button>
                </div>

                {/* Regular Menu (shown on large screens) */}
                <div className="hidden lg:flex items-center">
                    <ul className="menulist flex xl:gap-x-3 text-[#595959]">
                        <div className='flex items-center gap-x-6 text-base w-full'>
                            <li>
                                <Link href='/' className={currentPath === "/" ? "text-[#4EAC14]" : "text-[#595959]"}>
                                    หน้าแรก
                                </Link>
                            </li>
                            <li>
                                <Link href='/about' className={currentPath === "/about" ? "text-[#4EAC14]" : "text-[#595959]"}>
                                    เกี่ยวกับเรา
                                </Link>
                            </li>

                            {status === 'unauthenticated' && (
                                <li>
                                    <Link href='/register' className={currentPath === "/register" ? "text-[#4EAC14]" : "text-[#595959]"}>
                                        สมัครสมาชิก
                                    </Link>
                                </li>
                            )}

                            <li>
                                <Link href='/cart' className={currentPath === "/cart" ? "text-[#4EAC14]" : "text-[#595959]"}>
                                    ตะกร้า
                                </Link>
                                <span className={`text-white text-base rounded-full ml-1 px-2 ${cartItemCount >= 1 ? "bg-[#4EAC14]" : "bg-[#a8a8a8]"}`}>
                                    {cartItemCount}
                                </span>
                            </li>

                            {session?.user?.role === 'farmer' && (
                                <li>
                                    <Link href='/dashboard' className={currentPath === '/dashboard' ? "text-[#4EAC14]" : "text-[#595959]"}>
                                        แดชบอร์ดเกษตรกร
                                    </Link>
                                </li>
                            )}
                        </div>


                        {status === 'authenticated' && session?.user ? (
                            <div className="relative inline-block text-left">
                                <Dropdown
                                    placement="top-end"
                                    showArrow={true}

                                >
                                    <PopoverTrigger>

                                        <Button
                                            variant="bordered"
                                            disableRipple="true"
                                            backdrop="blur"
                                        >
                                            <svg
                                                className={`fill-current hover:text-[#4EAC14] ${activePaths.includes(currentPath) ? 'text-[#4EAC14]' : 'text-[#595959]'}`}
                                                xmlns="http://www.w3.org/2000/svg"
                                                height="30px" viewBox="0 -960 960 960"
                                                width="30px" fill="#595959">
                                                <path d="M170-254.62q-12.75 0-21.37-8.63-8.63-8.62-8.63-21.38 0-12.75 8.63-21.37 8.62-8.61 21.37-8.61h620q12.75 0 21.37 8.62 8.63 8.63 8.63 21.39 0 12.75-8.63 21.37-8.62 8.61-21.37 8.61H170ZM170-450q-12.75 0-21.37-8.63-8.63-8.63-8.63-21.38 0-12.76 8.63-21.37Q157.25-510 170-510h620q12.75 0 21.37 8.63 8.63 8.63 8.63 21.38 0 12.76-8.63 21.37Q802.75-450 790-450H170Zm0-195.39q-12.75 0-21.37-8.62-8.63-8.63-8.63-21.39 0-12.75 8.63-21.37 8.62-8.61 21.37-8.61h620q12.75 0 21.37 8.63 8.63 8.62 8.63 21.38 0 12.75-8.63 21.37-8.62 8.61-21.37 8.61H170Z" />
                                            </svg>
                                        </Button>
                                    </PopoverTrigger>

                                    <DropdownMenu
                                        aria-label="Static Actions"

                                        className='pl-[30px]  pb-[10px]  pt-[30px] w-[250px] h-fit bg-white border shadow-lg rounded-lg  '
                                    >
                                        <DropdownItem
                                            className={`dropdown-item ${currentPath === '/account/user/profile' ? 'text-[#4EAC14]' : 'text-[#595959]'} text-left `}
                                            textValue="โปรไฟล์"
                                            href="/account/user/profile"
                                        >
                                            บัญชีผู้ใช้
                                        </DropdownItem>

                                        <DropdownItem
                                            key="farmer register "
                                            className={`dropdown-item ${currentPath === '/register_farmer' ? 'text-[#4EAC14]' : 'text-[#595959]'} text-left `}
                                            textValue="ลงทะเบียนเกษตรกร"
                                            href='/register_farmer'
                                        >
                                            ลงทะเบียนเกษตรกร
                                        </DropdownItem>

                                        <DropdownItem key="signout" className='dropdown-item text-red-500 hover:text-red-500 text-left' textValue="ออกจากระบบ">
                                            <button onClick={() => signOut({ callbackUrl: '/' })}>
                                                ออกจากระบบ
                                            </button>
                                        </DropdownItem>

                                    </DropdownMenu>
                                </Dropdown>
                            </div>
                        ) : (
                            <li>
                                <Link href='/login' className={currentPath === "/login" ? "text-[#4EAC14]" : "text-[#595959]"}>
                                    เข้าสู่ระบบ
                                </Link>
                            </li>
                        )}
                    </ul>
                </div>

                {/* Mobile Menu (shown when the hamburger icon is clicked) */}
                {isMenuOpen && (
                    <div ref={dropdownRef}
                        className={`dropdown-button lg:hidden absolute top-[90px] right-0 w-full bg-white shadow-lg transition-all duration-300 ease-in-out transform ${menuAnimation ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
                            }`}>
                        <ul className="flex flex-col items-start p-4 " >
                            <div className='w-full text-lg'>
                                <li>
                                    <Link href='/'
                                        className={currentPath === "/" ? "text-[#4EAC14] block px-4 py-2 " : "block  px-4 py-2  text-gray-700 hover:bg-gray-100"}
                                        onClick={toggleMenu}>
                                        หน้าแรก
                                    </Link>
                                </li>
                                <li>
                                    <Link href='/about'
                                        className={currentPath === "/about" ? "text-[#4EAC14] block px-4 py-2 " : "block  px-4 py-2  text-gray-700 hover:bg-gray-100"}
                                        onClick={toggleMenu}>
                                        เกี่ยวกับเรา
                                    </Link>
                                </li>
                                {status === 'unauthenticated' && (
                                    <li>
                                        <Link href='/register'
                                            className={currentPath === "/register" ? "text-[#4EAC14] block px-4 py-2 " : "block  px-4 py-2  text-gray-700 hover:bg-gray-100"}
                                            onClick={toggleMenu}>
                                            สมัครสมาชิก
                                        </Link>
                                    </li>
                                )}
                                <li>
                                    <Link href='/cart'
                                        className={currentPath === "/cart" ? "text-[#4EAC14] block px-4 py-2 " : "block  px-4 py-2  text-gray-700 hover:bg-gray-100"}
                                        onClick={toggleMenu}>
                                        ตะกร้า

                                        <span
                                            className={`text-white text-base rounded-full ml-1 px-2 ${cartItemCount >= 1 ? "bg-[#4EAC14]" : "bg-[#a8a8a8]"}`}>
                                            {cartItemCount}
                                        </span>
                                    </Link>

                                </li>
                                {session?.user?.role === 'farmer' && (
                                    <li>
                                        <Link href='/dashboard'
                                            className={currentPath === "/dashboard" ? "text-[#4EAC14] block px-4 py-2 " : "block  px-4 py-2  text-gray-700 hover:bg-gray-100"}
                                            onClick={toggleMenu}>
                                            แดชบอร์ดเกษตรกร
                                        </Link>
                                    </li>
                                )}
                                {status === 'authenticated' && session?.user ? (
                                    <>
                                        <li>
                                            <Link href='/account/user/profile' onClick={toggleMenu}
                                                className={currentPath === "/account/user/profile" ? "text-[#4EAC14] block px-4 py-2 " : "block px-4 py-2  text-gray-700 hover:bg-gray-100"}
                                            >บัญชีผู้ใช้</Link>
                                        </li>
                                        <li>
                                            <Link href='/register_farmer'
                                                onClick={toggleMenu}
                                                className={currentPath === "/register_farmer" ? "text-[#4EAC14] block px-4 py-2 " : "block  px-4 py-2  text-gray-700 hover:bg-gray-100"}
                                            >
                                                ลงทะเบียนเกษตรกร</Link>
                                        </li>
                                        <li className='text-red-400 block  px-4 py-2   hover:bg-gray-100'>
                                            <button
                                                onClick={() => {
                                                    signOut({ callbackUrl: '/' });
                                                    toggleMenu(); // Close the menu on sign out
                                                }}
                                            >
                                                ออกจากระบบ
                                            </button>
                                        </li>
                                    </>
                                ) : (
                                    <li>
                                        <Link href='/Login'
                                            className={currentPath === "/Login" ? "text-[#4EAC14] block px-4 py-2 " : "block  px-4 py-2  text-gray-700 hover:bg-gray-100"}
                                            onClick={toggleMenu}>
                                            เข้าสู่ระบบ
                                        </Link>
                                    </li>
                                )}
                            </div>

                        </ul>
                    </div>
                )}
            </div>
        </div>
    );


}
export default Navbar