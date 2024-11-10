"use client";

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


const Sidebar = () => {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState({
    name: "Loading...",
    role: "Loading...",
  });


  const handleLogout = () => {
    router.push("/login"); 
  };

  return (
    <div className={styles.container}>
      <ul className={`${styles.list}`}>
        {menuItems.map((cat) => (
          <li key={cat.title}>
            <span className={styles.cat}>{cat.title}</span>
            {cat.list.map((item) => (
              <MenuLink
                item={item}
                key={item.title}
                isActive={pathname === item.path}
              />
            ))}
          </li>
        ))}
      </ul>
      <button className={styles.logout} onClick={handleLogout}>
        <MdLogout />
        ลงชื่อออก
      </button>
    </div>
  );
};


// Define the menu items
const menuItems = [
  {
    list: [
      {
        title: "หน้าหลัก",
        path: "/dashboard_municipality",
        icon: <MdDashboard />,
      },
    ],
  },
  {
    title: "ใบรับรอง",
    list: [
      {
        title: "จัดการผู้ใช้",
        path: "/dashboard_municipality/users",
        icon: <MdSupervisedUserCircle />,
      },
      {
        title: "ตรวจสอบใบรับรอง",
        path: "/dashboard_municipality/certificate",
        icon: <MdAssignment />,
      },
      {
        title: "จัดการมาตราฐาน",
        path: "/dashboard_municipality/manage_standards",
        icon: <MdGavel />,
      },
      {
        title: "จัดการเกษตกร",
        path: "/dashboard_municipality/manage_farmer",
        icon: <MdGavel />,
      },
    ],
  },
  {
    title: "สินค้า",
    list: [
      {
        title: "จัดการคำสั่งซื้อ",
        path: "/dashboard_municipality/orders",
        icon: <MdPeople />,
      },
      {
        title: "ประวัติการขาย",
        path: "/dashboard_municipality/transactions",
        icon: <MdAttachMoney />,
      },
      {
        title: "ช่องทางชำระเงิน",
        path: "/dashboard_municipality/chennel",
        icon: <MdMoney />,
      },
    ],
  },
  {
    title: "วิเคราะห์",
    list: [
      {
        title: "ตรวจสอบย้อนกลับ",
        path: "/dashboard_municipality/traceability",
        icon: <MdAnalytics />,
      },
      {
        title: "การตั้งค่า",
        path: "/dashboard_municipality/settings",
        icon: <MdOutlineSettings />,
      },
      {
        title: "ช่วยเหลือ",
        path: "/dashboard_municipality/help",
        icon: <MdHelpCenter />,
      },
    ],
  },
];




export default Sidebar;
