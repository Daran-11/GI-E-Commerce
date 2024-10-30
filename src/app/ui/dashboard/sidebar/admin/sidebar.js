"use client"
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  MdAnalytics,
  MdAttachMoney,
  MdDashboard,
  MdHelpCenter,
  MdLogout,
  MdMoney,
  MdOutlineSettings,
  MdPeople,
  MdShoppingBag,
  MdSupervisedUserCircle,
  MdEmojiPeople
} from "react-icons/md";
import { FaBackspace } from "react-icons/fa";
import MenuLink from './menuLink/menuLink'; // Ensure this path is correct
// Define the menu items
const menuItems = [
  {
    title: "",
    list: [
      {
        title: "กลับไปยังหน้าซื้อ",
        path: "/",
        icon: <FaBackspace />,

      },
    ],
  },

  {


    title: "หน้า",
    list: [
      {
        title: "หน้าหลัก",
        path: "/admin-dashboard",
        icon: <MdDashboard />,
      },
      {
        title: "จัดการผู้ใช้",
        path: "/admin-dashboard/user-management",
        icon: <MdEmojiPeople />,
      },
      {
        title: "คำร้องเรียน",
        path: "/admin-dashboard/report",
        icon: <MdHelpCenter />,
      },
      {
        title: "จัดการสินค้า",
        path: "/admin-dashboard/products-management",
        icon: <MdShoppingBag />,
      },
      {
        title: "ประวัติการทำธุรกรรม",
        path: "/admin-dashboard/transaction-management",
        icon: <MdAttachMoney />,
      },

    ],
  },

  {
    title: "ผู้ใช้",
    list: [
      {
        title: "การตั้งค่า",
        path: "/admin-dashboard/settings",
        icon: <MdOutlineSettings />,
      },

    ]
  }
];

// Define the Sidebar component
const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="hidden xl:block fixed top-0 w-[330px] h-screen bg-[var(--bgSoft)] shadow-md z-50">
      {/* Logo at the top of the sidebar */}
      <div className="flex items-center justify-center bg-white py-4 ">
        <Image src="/logo/logo.png" alt="Logo" width={250} height={250} />
      </div>

      <div className="containerlist w-[315px] h-[calc(100vh-160px)] overflow-hidden mt-2 px-2">
        <ul className="list-none text-[#878d84] h-full w-full overflow-y-auto">
          {menuItems.map((cat) => (
            <li key={cat.title}>
              <span className="text-[var(--textSoft)] font-bold text-[13px] my-2.5">
                {cat.title}
              </span>
              {cat.list.map((item) => (
                <MenuLink item={item} key={item.title} isActive={pathname === item.path} />
              ))}
            </li>
          ))}
        </ul>
      </div>

      <button className="  flex items-center gap-2 cursor-pointer rounded-lg bg-transparent border-0 text-[#878d84] w-full hover:bg-white hover:shadow-md">
        <MdLogout />
        ลงชื่อออก
      </button>
    </aside>
  );
};

export default Sidebar;