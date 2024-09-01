'use client';

import React, { useEffect, useState } from 'react';
import styles from './sidebar.module.css';
import {
  MdDashboard,
  MdSupervisedUserCircle,
  MdShoppingBag,
  MdAttachMoney,
  MdAnalytics,
  MdPeople,
  MdOutlineSettings,
  MdHelpCenter,
  MdLogout,
  MdMoney,
} from 'react-icons/md';
import MenuLink from './menuLink/menuLink'; 
import Image from 'next/image';
import { usePathname } from 'next/navigation';

// Define the menu items
const menuItems = [
  {
   
    list: [
      { title: 'หน้าหลัก', path: '/dashboard_municipality', icon: <MdDashboard /> },    
    ],
  },
  {
    title: 'ใบรับรอง',
    list: [
      { title: 'ตรวจสอบใบรับรอง', path: '/dashboard_municipality/certificate', icon: <MdSupervisedUserCircle /> },
    ],
  },
  {
    title: 'สินค้า',
    list: [
      { title: 'จัดการสินค้า', path: '/dashboard_municipality/products', icon: <MdShoppingBag /> },
      { title: 'จัดการคำสั่งซื้อ', path: '/dashboard_municipality/orders', icon: <MdPeople /> },
      { title: 'ประวัติการขาย', path: '/dashboard_municipality/transactions', icon: <MdAttachMoney /> },
      { title: 'ช่องทางชำระเงิน', path: '/dashboard_municipality/chennel', icon: <MdMoney /> },
    ],
  },
  {
    title: 'วิเคราะห์',
    list: [
      { title: 'ตรวจสอบย้อนกลับ', path: '/dashboard_municipality/traceability', icon: <MdAnalytics /> },
      { title: 'การตั้งค่า', path: '/dashboard_municipality/settings', icon: <MdOutlineSettings /> },
      { title: 'ช่วยเหลือ', path: '/dashboard_municipality/help', icon: <MdHelpCenter /> },
    ],
  },
];

// Define the Sidebar component
const Sidebar = () => {
  const pathname = usePathname();
  const [user, setUser] = useState({ name: 'Loading...', role: 'Loading...' });

  useEffect(() => {
    const name = localStorage.getItem('name');
    const role = localStorage.getItem('role');
  
    if (name && role) {
      setUser({ name, role });
    } else {
      setUser({ name: 'Loading...', role: 'Loading...' });
    }
  }, []);
  
  
  
  

  return (
    <div className={styles.container}>
      <div className={styles.user}>
        <Image className={styles.userImage} src="/dinosaur.png" alt="" width="50" height="50" />
        <div className={styles.userDetail}>
          <span className={styles.username}>{user.name}</span>
          <span className={styles.userTitle}>{user.role}</span>
        </div>
      </div>
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
      <button className={styles.logout}>
        <MdLogout />
        ลงชื่อออก
      </button>
    </div>
  );
};

export default Sidebar;
