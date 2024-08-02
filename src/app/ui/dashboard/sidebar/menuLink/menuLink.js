// menuLink.js
'use client'
import React from 'react';
import Link from 'next/link';
import styles from './menuLink.module.css';

const MenuLink = ({ item, isActive }) => {
  return (
    <li className={styles.menuLink}>
      <Link href={item.path}>
        <a className={`${styles.link} ${isActive ? styles.active : ''}`}>
          {item.icon}
          <span>{item.title}</span>
        </a>
      </Link>
    </li>
  );
};

export default MenuLink;
