// menuLink.js
'use client'
import React from 'react';
import Link from 'next/link';
import styles from './menuLink.module.css';

const activeColors = {
  "หน้าหลัก": styles.activeDashboard,
  "จัดการสินค้า": styles.activeProducts,
  "จัดการคำสั่งซื้อ": styles.activeOrders,
  "ประวัติการขาย": styles.activeHistory,
  "ตรวจสอบสินค้า": styles.activeCheckProducts,
  "ตรวจสอบย้อนกลับ": styles.activeTraceability,
  "ลงทะเบียนใบรับรอง": styles.activeCertificate,
  "การตั้งค่า": styles.activeSettings,
  "ช่วยเหลือ": styles.activeHelp,
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
