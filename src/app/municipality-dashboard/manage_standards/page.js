"use client";
import { useState, useEffect } from "react";
import styles from "@/app/ui/dashboard/certificate/certificate.module.css";
import Link from "next/link";
import Pagination from "@/app/ui/dashboard/pagination/pagination";
import Search from "@/app/ui/dashboard/search/search";
import Image from "next/image";
import { MdEdit, MdDelete } from 'react-icons/md';
import { toast } from "react-toastify";

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
          toast.success("ลบมาตรฐานเรียบร้อยแล้ว");
          setStandards(standards.filter((std) => std.id !== id));
        } else {
          toast.error("ไม่สามารถลบมาตรฐานได้");
        }
      } catch (error) {
        console.error("Failed to delete standard:", error);
      }
    }
  };

  return (
    <div className={styles.container}>
      <h1 className="text-2xl ">จัดการมาตรฐาน</h1><br></br>
      <div className={styles.top}>
        <Search placeholder="ค้นหามาตรฐาน..." />
        <Link href="/municipality-dashboard/manage_standards/add">
          <button className={styles.addButton}>เพิ่มมาตรฐานใหม่</button>
        </Link>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <td>#</td>
            <td>ชื่อมาตรฐาน</td>
            <td>โลโก้</td>
            <td>ข้อมูลมาตรฐานการรับรองสินค้า</td>
            <td>การดำเนินการ</td>
          </tr>
        </thead>
        <tbody>
          {standards.length > 0 ? (
            standards.map((standard, index) => (
              <tr key={standard.id}>
                <td>{index + 1}</td>
                <td>{standard.name}</td>
                <td>
                  <div className={styles.standardsContainer}>
                    <Image
                      src={standard.logoUrl}
                      alt={standard.name}
                      width={50}
                      height={50}
                      className={styles.standardLogo}
                    />
                  </div>
                </td>
                <td>{standard.certificationInfo}</td>
                <td>
                  <div className={styles.standardsContainer}>
                    <div className={styles.buttons}>
                      <Link href={`/municipality-dashboard/manage_standards/edit/${standard.id}`}>
                        <button className={`${styles.iconButton} ${styles.edit}`} title="แก้ไข">
                          <MdEdit />
                        </button>
                      </Link>
                      <button
                        className={`${styles.iconButton} ${styles.delete}`}
                        onClick={() => handleDelete(standard.id)}
                        title="ลบ"
                      >
                        <MdDelete />
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5}>ไม่พบข้อมูล</td>
            </tr>
          )}
        </tbody>
      </table>
      <Pagination />
    </div>
  );
};

export default Standards;