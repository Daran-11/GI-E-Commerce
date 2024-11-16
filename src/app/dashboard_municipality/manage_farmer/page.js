"use client";
import React, { useState, useEffect } from "react";
import styles from "@/app/ui/dashboard/certificate/certificate.module.css";
import Link from "next/link";
import Pagination from "@/app/ui/dashboard/pagination/pagination";
import Search from "@/app/ui/dashboard/search/search";
import { MdEdit, MdDelete } from 'react-icons/md';

const ManageFarmer = () => {
  const [manage_farmer, setManage_farmer] = useState([]); // แก้ให้ชื่อตัวแปรตรงกัน

  // เพิ่มฟังก์ชันสำหรับดึงข้อมูล
  const fetchFarmers = async () => {
    try {
      const response = await fetch("/api/manage_farmer");
      if (!response.ok) {
        throw new Error('Failed to fetch farmers');
      }
      const data = await response.json();
      setManage_farmer(data);
    } catch (error) {
      console.error("Failed to fetch farmers:", error);
    }
  };

  useEffect(() => {
    fetchFarmers();
  }, []);

  const handleDelete = async (id) => {
    if (confirm("คุณแน่ใจหรือไม่ว่าต้องการลบเกษตรกรนี้?")) {
      try {
        const response = await fetch(`/api/manage_farmer?id=${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          setManage_farmer(prev => prev.filter(farmer => farmer.id !== id));
          alert("ลบเกษตรกรเรียบร้อยแล้ว");
        } else {
          const error = await response.json();
          throw new Error(error.message || "ไม่สามารถลบเกษตรกรได้");
        }
      } catch (error) {
        console.error("Failed to delete farmer:", error);
        alert(error.message || "เกิดข้อผิดพลาดในการลบข้อมูล");
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
            <td>#</td>
            <td>ชื่อ-นามสกุล</td>
            <td>ชนิด</td>
            <td>พันธุ์</td>
            <td>ชื่อมาตรฐาน</td>
            <td>หมายเลขใบรับรอง</td>
            <td>วันที่อนุมัติ</td>
            <td>การดำเนินการ</td>
          </tr>
        </thead>
        <tbody>
          {manage_farmer.length > 0 ? (
            manage_farmer.map((manage_farmer, index) => (
              <React.Fragment key={manage_farmer.id}>
                {/* แสดงข้อมูลเกษตรกรพร้อมใบรับรองใบแรก */}
                <tr>
                  <td>{index + 1}</td>
                  <td>{manage_farmer.farmerName}</td>
                  {manage_farmer.certificates.length > 0 ? (
                    <>
                      <td>{manage_farmer.certificates[0].type}</td>
                      <td>{manage_farmer.certificates[0].variety}</td>
                      <td>{manage_farmer.certificates[0].standardName}</td>
                      <td>{manage_farmer.certificates[0].certificateNumber}</td>
                      <td>{new Date(manage_farmer.certificates[0].approvalDate).toLocaleDateString()}</td>
                    </>
                  ) : (
                    <td colSpan={3}>ไม่มีใบรับรอง</td>
                  )}
                  <td>
                  <div className={styles.standardsContainer}>
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
                    </div>
                  </td>
                </tr>

           
                {manage_farmer.certificates.slice(1).map((certificate, certIndex) => (
                  <tr key={certIndex}>
                    <td></td> 
                    <td></td> 
                    <td>{certificate.type}</td>
                    <td>{certificate.variety}</td>
                    <td>{certificate.standardName}</td>
                    <td>{certificate.certificateNumber}</td>
                    <td>{new Date(certificate.approvalDate).toLocaleDateString()}</td>
                    <td></td> 
                  </tr>
                ))}
              </React.Fragment>
            ))
          ) : (
            <tr>
              <td colSpan={7}>ไม่พบข้อมูล</td>
            </tr>
          )}
        </tbody>
      </table>
      <Pagination />
    </div>
  );
};

export default ManageFarmer;
