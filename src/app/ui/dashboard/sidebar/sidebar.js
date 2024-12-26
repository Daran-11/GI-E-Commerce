'use client';

import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
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
} from 'react-icons/md';
import MenuLink from './menuLink/menuLink';
import styles from './sidebar.module.css';

// Define the Sidebar component
const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState({ name: 'Loading...', lastname: 'Loading...', role: 'Loading...' });

  useEffect(() => {
    const name = localStorage.getItem('name');
    const lastname = localStorage.getItem('lastname');
    const role = localStorage.getItem('role');

    if (name && lastname && role) {
      setUser({ name, lastname, role });

      // Redirect to municipality-dashboard if role is เทศบาล or admin
      if (role === 'เทศบาล' || role === 'admin') {
        router.push('/municipality-dashboard');
      } else if (role !== 'เกษตรกร') {
        router.push('/login'); // Redirect to login if role is not เกษตรกร, เทศบาล, or admin
      }
    } else {
      // Redirect to login if user data is not available
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    router.push('/login'); // Redirect to login page or any other page
  };

  return (
    <div className={styles.container}>
      <div className={styles.user}>
        <Image className={styles.userImage} src="/dinosaur.png" alt="" width="50" height="50" />
        <div className={styles.userDetail}>
          <span className={styles.username}>{user.name} {user.lastname}</span>
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
      { title: 'หน้าหลัก', path: '/dashboard', icon: <MdDashboard /> },
    ],
  },
  {
    title: 'ใบรับรอง',
    list: [
      { title: 'ลงทะเบียนใบรับรอง', path: '/dashboard/certificate', icon: <MdSupervisedUserCircle /> },
    ],
  },
  {
    title: 'สินค้า',
    list: [
      { title: 'จัดการสินค้า', path: '/dashboard/products', icon: <MdShoppingBag /> },
      { title: 'จัดการคำสั่งซื้อ', path: '/dashboard/orders', icon: <MdPeople /> },
      { title: 'ประวัติการขาย', path: '/dashboard/transactions', icon: <MdAttachMoney /> },
      { title: "ช่องทางรับเงิน", path: "/dashboard/payment-method", icon: <MdMoney /> },
    ],
  },
  {
    title: 'วิเคราะห์',
    list: [
      { title: 'ตรวจสอบย้อนกลับ', path: '/dashboard/traceability', icon: <MdAnalytics /> },
      { title: 'การตั้งค่า', path: '/dashboard/settings', icon: <MdOutlineSettings /> },
      { title: 'ช่วยเหลือ', path: '/dashboard/help', icon: <MdHelpCenter /> },
    ],
  },
];



export default Sidebar;
