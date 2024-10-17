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
  MdSupervisedUserCircle
} from "react-icons/md";
import MenuLink from './menuLink/menuLink'; // Ensure this path is correct
// Define the menu items
const menuItems = [
  {
    title: "หน้า",
    list: [
      {
        title: "หน้าหลัก",
        path: "/dashboard",
        icon: <MdDashboard />,
      },
      {
        title: "จัดการสินค้า",
        path: "/dashboard/products",
        icon: <MdShoppingBag />,
      },
      {
        title: 'จัดการคำสั่งซื้อ',
        path: "/dashboard/orders",
        icon: <MdPeople />,
      },
      {
        title: "ประวัติการขาย",
        path: "/dashboard/transactions",
        icon: <MdAttachMoney />,
      },

    ],
  },
  {
    title: "วิเคราะห์",
    list: [
      {
        title: "ตรวจสอบย้อนกลับ",
        path: '/dashboard/traceability',
        icon: <MdAnalytics />,
      },

    ]
  },
  {
    title: "ผู้ใช้",
    list: [
      {
        title: "ลงทะเบียนใบรับรอง",
        path: "/dashboard/certificate",
        icon: <MdSupervisedUserCircle />,
      },
      {
        title: "ช่องทางชำระเงิน",
        path: "/dashboard/chennel",
        icon: <MdMoney />,
      },
      {
        title: "การตั้งค่า",
        path: "/dashboard/settings",
        icon: <MdOutlineSettings  />,
      },
      {
        title: "ช่วยเหลือ",
        path: "/dashboard/help",
        icon: <MdHelpCenter />,
      },
    ]
  }
];

// Define the Sidebar component
const Sidebar = () => {
  const { data: session, status } = useSession()

  const pathname = usePathname()

  return (
    <div>
          <aside className="hidden  xl:block fixed top-[90px] bg-[var(--bgSoft)] w-fit  h-screen max-w-[330px] py-0 px-2">
      <div className="pt-2 flex items-center gap-5 mb-4.5">
        <Image className="rounded-full object-cover" src="/dinosaur.png" alt="" width="50" height="50" />
        <div className="flex flex-col">
          <span className="font-medium text-lg">{session.user.name}</span>
          <span className="text-base text-[var(--textSoft)]">{session.user.role}</span>
        </div>
      </div>
      <div className="containerlist w-[315px] h-[70vh] overflow-hidden">
        <ul className="list-none text-[#878d84] h-full w-full overflow-y-auto">

          {menuItems.map((cat) => (
            <li key={cat.title}>
              <span className="text-[var(--textSoft)] font-bold text-[13px] my-2.5">{cat.title}</span>
              {cat.list.map((item) => (
                <MenuLink item={item} key={item.title} isActive={pathname === item.path} />
              ))}
            </li>
          ))}

        </ul>        
        </div>

      <button className="py-5 my-1 flex items-center gap-2 cursor-pointer rounded-lg bg-transparent border-0 text-[#878d84] w-full hover:bg-white hover:shadow-[0_0_10px_8px_rgba(0,0,0,0.1)]">
        <MdLogout />
        ลงชื่อออก
      </button>
    </aside>   
    </div>
   
  );
}

export default Sidebar;
