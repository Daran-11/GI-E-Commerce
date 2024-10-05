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
import styles from "./sidebar.module.css";
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
    
    <div className={styles.container}>
      <div className={styles.user}>
        <Image className={styles.userImage} src="/dinosaur.png" alt="" width="50" height="50" />
        <div className={styles.userDetail}>
          <span className={styles.username}>{session.user.name}</span>
          <span className={styles.userTitle}>{session.user.role}</span>
        </div>
      </div>
      <div className={styles.containerlist}>
        <ul className={`${styles.list}`}>

          {menuItems.map((cat) => (
            <li key={cat.title}>
              <span className={styles.cat}>{cat.title}</span>
              {cat.list.map((item) => (
                <MenuLink item={item} key={item.title} isActive={pathname === item.path} />
              ))}
            </li>
          ))}

        </ul>        
        </div>

      <button className={styles.logout}>
        <MdLogout />
        ลงชื่อออก
      </button>
    </div>
  );
}

export default Sidebar;
