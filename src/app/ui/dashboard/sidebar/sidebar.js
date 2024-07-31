
import React from 'react';
import styles from "./sidebar.module.css";
import {
  MdDashboard,
  MdSupervisedUserCircle,
  MdShoppingBag,
  MdAttachMoney,
  MdWork,
  MdAnalytics,
  MdPeople,
  MdOutlineSettings,
  MdHelpCenter,
  MdLogout,
} from "react-icons/md";
import MenuLink from './menuLink/menuLink'; // Ensure this path is correct
import Image from 'next/image';

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
        title: "จัดการผู้ใช้",
        path: "/dashboard/users",
        icon: <MdSupervisedUserCircle />,
      },
      {
        title: "จัดการสินค้า",
        path: "/dashboard/products",
        icon: <MdShoppingBag />,
      },
      {
        title: "ประวัติการขาย",
        path: "/dashboard/transactions",
        icon: <MdAttachMoney />,
      },
      {
        title: 'จัดการคำสั่งซื้อ',
        path: "/dashboard/teams",
        icon: <MdPeople />,
      },
    ],
  },
  {
    title: "วิเคราะห์",
    list: [
      {
        title: "ตรวจสอบสินค้า",
        path: "/dashboard/revenue",
        icon: <MdWork />,
      },
      {
        title: "ตรวจสอบคำร้องเรียน",
        path: '/dashboard/reports',
        icon: <MdAnalytics />,
      },
      
    ]
  },
  {
    title: "ผู้ใช้",
    list: [
      {
        title: "การตั้งค่า",
        path: "/dashboard/settings",
        icon: <MdOutlineSettings />,
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
  return (
    <div className={styles.container}>
      <div className={styles.user}>
        <Image className={styles.userImage} src="/noavatar.png" alt="" width="50" height="50" />
        <div className={styles.userDetail}>
          <span className={styles.username}>ธนธร เต็มสิริมงคล</span>
          <span className={styles.userTitle}>ผู้ดูแลระบบ</span>
        </div>
      </div>
      <ul className={styles.list}>
        {menuItems.map((cat) => (
          <li key={cat.title}>
            <span className={styles.cat}>{cat.title}</span>
            {cat.list.map((item) => (
              <MenuLink item={item} key={item.title} />
            ))}
          </li>
        ))}
      </ul>
      <button className={styles.logout}>
        <MdLogout />
        ลงชื่อออก
      </button>
    </div>
  );
}

export default Sidebar;
