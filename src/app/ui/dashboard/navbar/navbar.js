// components/Navbar.js
"use client";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Notification from "../notification/notification"; // Import the Notification component

const Navbar = ({session}) => {
  const pathname = usePathname();

  // Define a mapping of pathnames to Thai titles
  const titleMap = {
    dashboard: "หน้าหลัก",
    products: "จัดการสินค้า",
    orders: "จัดการคำสั่งซื้อ",
    transactions: "ประวัติการขาย",
    certificate: "ลงทะเบียนใบรับรอง",
    add: "ลงทะเบียนใบรับรอง",
    // Add more pathnames and corresponding Thai titles as needed
  };

  // Get the last part of the pathname and map it to a Thai title
  const currentTitle = titleMap[pathname.split("/").pop()] || "ไม่พบหน้าที่ต้องการ";

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md h-[60px] flex items-center justify-between px-6 z-50">
      <h1 className="font-normal text-xl">แดชบอร์ด</h1>
      <div className="flex items-center space-x-4">
        <Notification />
        <div className="flex items-center space-x-2">
          {session.user.id ?(
            <>
              <Image
                className="rounded-full object-cover"
                src="/dinosaur.png" // Adjust to the path of the user profile image
                alt="User Avatar"
                width={50}
                height={50}
              />
              <div>
                <span className="text-gray-700 font-medium">{session.user.name}</span>
                <span className="text-[var(--textSoft)] text-base block mt-1">{session.user.role}</span>
              </div>
            </>
          ) : (
            <span className="text-gray-700 font-medium">Guest</span>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
