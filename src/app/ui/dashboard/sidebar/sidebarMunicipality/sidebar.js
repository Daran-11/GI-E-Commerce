"use client";
import Image from 'next/image';
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  MdAnalytics,
  MdAssignment,
  MdAttachMoney,
  MdDashboard,
  MdGavel,
  MdHelpCenter,
  MdLogout,
  MdMoney,
  MdOutlineSettings,
  MdPeople,
  MdSupervisedUserCircle
} from "react-icons/md";
import MenuLink from "./menuLink/menuLink";
import styles from "./sidebar.module.css";
import { FaBackspace } from "react-icons/fa";





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
        path: "/municipality-dashboard",
        icon: <MdDashboard />,
      },
    ],
  },
  {
    title: "ใบรับรอง",
    list: [
      {
        title: "จัดการผู้ใช้",
        path: "/municipality-dashboard/users",
        icon: <MdSupervisedUserCircle />,
      },
      {
        title: "จัดการชนิดของสินค้า",
        path: "/municipality-dashboard/manage-type",
        icon: <MdSupervisedUserCircle />,
      },
      {
        title: "ตรวจสอบใบรับรอง",
        path: "/municipality-dashboard/certificate",
        icon: <MdAssignment />,
      },
      {
        title: "จัดการมาตราฐาน",
        path: "/municipality-dashboard/manage_standards",
        icon: <MdGavel />,
      },
      {
        title: "จัดการเกษตกร",
        path: "/municipality-dashboard/manage_farmer",
        icon: <MdGavel />,
      },
    ],
  },
  {
    title: "วิเคราะห์",
    list: [
      {
        title: "การตั้งค่า",
        path: "/municipality-dashboard/settings",
        icon: <MdOutlineSettings />,
      },
      {
        title: "ช่วยเหลือ",
        path: "/municipality-dashboard/help",
        icon: <MdHelpCenter />,
      },
    ],
  },
];

// Define the Sidebar component
const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="hidden xl:block fixed top-13 w-[330px] h-screen bg-[var(--bgSoft)] shadow-md z-50">
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
}

export default Sidebar;

