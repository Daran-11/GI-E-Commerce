"use client";
import React, { useState, useEffect } from "react";
import styles from "@/app/ui/dashboard/certificate/certificate.module.css";
import Link from "next/link";
import Pagination from "@/app/ui/dashboard/pagination/pagination";
import Search from "@/app/ui/dashboard/search/search";
import { MdEdit, MdDelete } from 'react-icons/md';

const ManageFarmers = () => {
  const [manage_farmers, setManage_farmers] = useState([]);

  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        const response = await fetch("/api/manage_farmer");
        const data = await response.json();
        setManage_farmers(data);
      } catch (error) {
        console.error("Failed to fetch farmers:", error);
      }
    };

    fetchFarmers();
  }, []);

  const handleDelete = async (id) => {
    if (confirm("คุณแน่ใจหรือไม่ว่าต้องการลบเกษตรกรนี้?")) {
      try {
        const response = await fetch(`/api/manage_farmer?id=${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          alert("ลบเกษตรกรเรียบร้อยแล้ว");
          setManage_farmers(manage_farmers.filter((manage_farmer) => manage_farmer.id !== id));
        } else {
          alert("ไม่สามารถลบเกษตรกรได้");
        }
      } catch (error) {
        console.error("Failed to delete farmer:", error);
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <Search placeholder="ค้นหาเกษตรกร..." />
        <Link href="/dashboard_municipality/manage_farmer/add">
          <button className={styles.addButton}>เพิ่มเกษตรกรใหม่</button>
        </Link>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <td>ลำดับ</td>
            <td>ชื่อ</td>
            <td>นามสกุล</td>
            <td>ชื่อมาตรฐาน</td>
            <td>หมายเลขใบรับรอง</td>
            <td>วันที่อนุมัติ</td>
            <td>การดำเนินการ</td>
          </tr>
        </thead>
        <tbody>
          {manage_farmers.length > 0 ? (
            manage_farmers.map((manage_farmer, index) => (
              <React.Fragment key={manage_farmer.id}>
                {/* แสดงข้อมูลเกษตรกรพร้อมใบรับรองใบแรก */}
                <tr>
                  <td>{index + 1}</td>
                  <td>{manage_farmer.firstName}</td>
                  <td>{manage_farmer.lastName}</td>
                  {manage_farmer.certificates.length > 0 ? (
                    <>
                      <td>{manage_farmer.certificates[0].standardName}</td>
                      <td>{manage_farmer.certificates[0].certificateNumber}</td>
                      <td>{new Date(manage_farmer.certificates[0].approvalDate).toLocaleDateString()}</td>
                    </>
                  ) : (
                    <td colSpan={3}>ไม่มีใบรับรอง</td>
                  )}
                  <td>
                    <div className={styles.buttons}>
                      <Link href={`/dashboard_municipality/manage_farmer/edit/${manage_farmer.id}`}>
                        <button className={`${styles.iconButton} ${styles.edit}`} title="แก้ไข">
                          <MdEdit />
                        </button>
                      </Link>
                      <button
                        className={`${styles.iconButton} ${styles.delete}`}
                        onClick={() => handleDelete(manage_farmer.id)}
                        title="ลบ"
                      >
                        <MdDelete />
                      </button>
                    </div>
                  </td>
                </tr>

                {/* แสดงใบรับรองที่เหลือในบรรทัดถัดไป */}
                {manage_farmer.certificates.slice(1).map((certificate, certIndex) => (
                  <tr key={certIndex}>
                    <td></td> {/* ช่องว่างสำหรับลำดับ */}
                    <td></td> {/* ช่องว่างสำหรับชื่อ */}
                    <td></td> {/* ช่องว่างสำหรับนามสกุล */}
                    <td>{certificate.standardName}</td>
                    <td>{certificate.certificateNumber}</td>
                    <td>{new Date(certificate.approvalDate).toLocaleDateString()}</td>
                    <td></td> {/* ช่องว่างสำหรับการดำเนินการ */}
                  </tr>
                ))}
              </React.Fragment>
            ))
          ) : (
            <tr>
              <td colSpan={7}>ไม่พบข้อมูลเกษตรกร</td>
            </tr>
          )}
        </tbody>
      </table>
      <Pagination />
    </div>
  );
};

export default ManageFarmers;
