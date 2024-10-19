// menuLink.js
'use client'
import React from 'react';
import Link from 'next/link';
import styles from './menuLink.module.css';

const activeColors = {
  "หน้าหลัก": styles.activeDashboard,
  "จัดการผู้ใช้": styles.activeUserManagement,
  "จัดการสินค้า": styles.activeProducts,
  "ประวัติการทำธุรกรรม": styles.activeHistory,
  "การตั้งค่า": styles.activeSettings,
  "คำร้องเรียน": styles.activeHelp,
};


const MenuLink = ({ item, isActive }) => {
  const activeClass = isActive ? activeColors[item.title] : '';
  return (
    <Link
      href={item.path}
      className={`${styles.container} ${isActive ? styles.active : ''}`}>
      <span className={`${styles.icon} ${activeClass}`}>
        {item.icon}
      </span>
      <span>{item.title}</span>

    </Link>

  );
};

export default MenuLink;
