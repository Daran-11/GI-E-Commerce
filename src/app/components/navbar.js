import Link from "next/link";
import SearchBar from "./searchbar";
export const Navbar = () => {
    return (

        <div>
            <div className="header flex w-[80%] justify-between m-auto pt-[20px] pb-[15px]">
                <div className="logo m-auto">
                    <h2 className="text-2xl text-[#4EAC14]">GI Pineapple</h2>
                </div>

                <div className="search  w-[500px]">
                    <SearchBar/>
                </div>
                <div className="menu m-auto">
                    <nav>
                        <ul className="text-base text-[#595959] flex gap-[40px]">
                            <li>
                                <Link href=''>หน้าแรก</Link>
                            </li>
                            <li>
                                <Link href=''>เกี่ยวกับเรา</Link>
                            </li>
                            <li>
                                <Link href=''>สมัครสมาชิก</Link>
                            </li>
                            <li>
                                <Link href=''>เข้าสู่ระบบ</Link>
                            </li>
                            <li>
                                <Link href=''>ตะกร้าสินค้า</Link>
                            </li>
                        </ul>
                    </nav>
            
                </div>

            </div>
        </div>

    )


}
export default Navbar