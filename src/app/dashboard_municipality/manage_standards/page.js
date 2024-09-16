"use client";
import { useState, useEffect } from "react";
import styles from "@/app/ui/dashboard/certificate/certificate.module.css";
import Link from "next/link";
import Pagination from "@/app/ui/dashboard/pagination/pagination";
import Search from "@/app/ui/dashboard/search/search";
import Image from "next/image";
import { MdEdit, MdDelete } from 'react-icons/md';

const Standards = () => {
  const [standards, setStandards] = useState([]);

  useEffect(() => {
    const fetchStandards = async () => {
      try {
        const response = await fetch("/api/standards");
        const data = await response.json();
        setStandards(data);
      } catch (error) {
        console.error("Failed to fetch standards:", error);
      }
    };

    fetchStandards();
  }, []);

  const handleDelete = async (id) => {
    if (confirm("คุณแน่ใจหรือไม่ว่าต้องการลบมาตรฐานนี้?")) {
      try {
        const response = await fetch(`/api/standards?id=${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          alert("ลบมาตรฐานเรียบร้อยแล้ว");
          setStandards(standards.filter((std) => std.id !== id));
        } else {
          alert("ไม่สามารถลบมาตรฐานได้");
        }
      } catch (error) {
        console.error("Failed to delete standard:", error);
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <Search placeholder="ค้นหามาตรฐาน..." />
        <Link href="/dashboard_municipality/manage_standards/add">
          <button className={styles.addButton}>เพิ่มมาตรฐานใหม่</button>
        </Link>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <td>ลำดับ</td>
            <td>โลโก้</td>
            <td>ชื่อมาตรฐาน</td>
            <td>คำอธิบาย</td>
            <td>การดำเนินการ</td>
          </tr>
        </thead>
        <tbody>
          {standards.length > 0 ? (
            standards.map((standard, index) => (
              <tr key={standard.id}>
                <td>{index + 1}</td>
                <td>
                  <Image
                    src={standard.logoUrl}
                    alt={standard.name}
                    width={50}
                    height={50}
                    className={styles.standardLogo}
                  />
                </td>
                <td>{standard.name}</td>
                <td>{standard.description}</td>
                <td>
                  <div className={styles.buttons}>
                    <Link href={`/dashboard_municipality/manage_standards/edit/${standard.id}`}>
                      <button className={`${styles.iconButton} ${styles.edit}`} title="แก้ไข">
                        <MdEdit   />
                      </button>
                    </Link>
                    <button
                      className={`${styles.iconButton} ${styles.delete}`}
                      onClick={() => handleDelete(standard.id)}
                      title="ลบ"
                    >
                      <MdDelete  />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5}>ไม่พบข้อมูลมาตรฐาน</td>
            </tr>
          )}
        </tbody>
      </table>
      <Pagination />
    </div>
  );
};

export default Standards;