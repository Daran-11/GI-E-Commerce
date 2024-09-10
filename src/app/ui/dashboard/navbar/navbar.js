"use client";
import { usePathname } from "next/navigation";
import styles from "./navbar.module.css";
import { MdNotifications, MdOutlineChat, MdPublic, MdSearch } from "react-icons/md";

const Navbar = () => {
  const pathname = usePathname();

  // Define a mapping of pathnames to Thai titles
  const titleMap = {
    dashboard: "หน้าหลัก",
    products: "จัดการสินค้า",
    orders: "จัดการคำสั่งซื้อ",
    transactions: "ประวัติการขาย",
    certificate: "ลงทะเบียนใบรับรอง",
    // Add more pathnames and corresponding Thai titles as needed
  };

  // Get the last part of the pathname and map it to a Thai title
  const currentTitle = titleMap[pathname.split("/").pop()] || "ไม่พบหน้าที่ต้องการ";

  return (
    <div className={styles.container}>
      <div className={styles.title}>{currentTitle}</div>
      <div className={styles.menu}>
        <div className={styles.search}>
          <MdSearch />
          <input type="text" placeholder="ค้นหา..." className={styles.input} />
        </div>
        <div className={styles.icons}>
          <MdOutlineChat size={20} />
          <MdNotifications size={20} />
          <MdPublic size={20} />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
