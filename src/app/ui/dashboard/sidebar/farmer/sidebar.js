"use client";
import { usePathname } from "next/navigation";
import Image from "next/image";
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
import { FaBackspace } from "react-icons/fa";
import MenuLink from "./menuLink/menuLink";

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
      { title: "หน้าหลัก", path: "/dashboard", icon: <MdDashboard /> },
      { title: "จัดการสินค้า", path: "/dashboard/products", icon: <MdShoppingBag /> },
      { title: "จัดการคำสั่งซื้อ", path: "/dashboard/orders", icon: <MdPeople /> },
      { title: "ประวัติการขาย", path: "/dashboard/history", icon: <MdAttachMoney /> },
    ],
  },
  {
    title: "วิเคราะห์",
    list: [
      { title: "ตรวจสอบย้อนกลับ", path: "/dashboard/traceability", icon: <MdAnalytics /> },
    ],
  },
  {
    title: "ผู้ใช้",
    list: [
      { title: "ลงทะเบียนใบรับรอง", path: "/dashboard/certificate", icon: <MdSupervisedUserCircle /> },
      { title: "ช่องทางชำระเงิน", path: "/dashboard/chennel", icon: <MdMoney /> },
      { title: "การตั้งค่า", path: "/dashboard/settings", icon: <MdOutlineSettings /> },
      { title: "ช่วยเหลือ", path: "/dashboard/help", icon: <MdHelpCenter /> },
    ],
  },
];

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
};

export default Sidebar;