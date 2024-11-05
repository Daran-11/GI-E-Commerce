"use client";
import React, { useState, useEffect } from "react";
import styles from "@/app/ui/dashboard/certificate/certificate.module.css";
import Link from "next/link";
import Pagination from "@/app/ui/dashboard/pagination/pagination";
import Search from "@/app/ui/dashboard/search/search";
import { MdEdit, MdDelete } from 'react-icons/md';

const ManageUsers = () => {
  const [manage_Users, setManage_Users] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/manage_farmer");
        const data = await response.json();
        setManage_Users(data);
      } catch (error) {
        console.error("Failed to fetch Users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (confirm("คุณแน่ใจหรือไม่ว่าต้องการลบเกษตรกรนี้?")) {
      try {
        const response = await fetch(`/api/manage_farmer?id=${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          alert("ลบเกษตรกรเรียบร้อยแล้ว");
          setManage_Users(manage_Users.filter((manage_Users) => manage_Users.id !== id));
        } else {
          alert("ไม่สามารถลบเกษตรกรได้");
        }
      } catch (error) {
        console.error("Failed to delete Users:", error);
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
            <td>ชื่อ</td>
            <td>นามสกุล</td>
            <td>ชนิด</td>
            <td>พันธุ์</td>
            <td>ชื่อมาตรฐาน</td>
            <td>หมายเลขใบรับรอง</td>
            <td>วันที่อนุมัติ</td>
            <td>การดำเนินการ</td>
          </tr>
        </thead>
        <tbody>
          {manage_Users.length > 0 ? (
            manage_Users.map((manage_Users, index) => (
              <React.Fragment key={manage_Users.id}>
                {/* แสดงข้อมูลเกษตรกรพร้อมใบรับรองใบแรก */}
                <tr>
                  <td>{index + 1}</td>
                  <td>{manage_Users.firstName}</td>
                  <td>{manage_Users.lastName}</td>
                  {manage_Users.certificates.length > 0 ? (
                    <>
                      <td>{manage_Users.certificates[0].type}</td>
                      <td>{manage_Users.certificates[0].variety}</td>
                      <td>{manage_Users.certificates[0].standardName}</td>
                      <td>{manage_Users.certificates[0].certificateNumber}</td>
                      <td>{new Date(manage_Users.certificates[0].approvalDate).toLocaleDateString()}</td>
                    </>
                  ) : (
                    <td colSpan={3}>ไม่มีใบรับรอง</td>
                  )}
                  <td>
                  <div className={styles.standardsContainer}>
                    <div className={styles.buttons}>
                      <Link href={`/dashboard_municipality/manage_farmer/edit/${manage_Users.id}`}>
                        <button className={`${styles.iconButton} ${styles.edit}`} title="แก้ไข">
                          <MdEdit />
                        </button>
                      </Link>
                      <button
                        className={`${styles.iconButton} ${styles.delete}`}
                        onClick={() => handleDelete(manage_Users.id)}
                        title="ลบ"
                      >
                        <MdDelete />
                      </button>
                    </div>
                    </div>
                  </td>
                </tr>

           
                {manage_Users.certificates.slice(1).map((certificate, certIndex) => (
                  <tr key={certIndex}>
                    <td></td> 
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

export default ManageUsers;
