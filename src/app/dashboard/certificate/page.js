"use client";
import { useState, useEffect } from "react";
import styles from "@/app/ui/dashboard/certificate/certificate.module.css";
import Link from "next/link";
import Image from "next/image";
import Pagination from "@/app/ui/dashboard/pagination/pagination";
import Search from "@/app/ui/dashboard/search/search";

const Certificate = () => {
  const [certificates, setCertificates] = useState([]);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await fetch("/api/certificate/add");
        const data = await response.json();
        setCertificates(data);
      } catch (error) {
        console.error("Failed to fetch certificates:", error);
      }
    };

    fetchCertificates();
  }, []);

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this certificate?")) {
      try {
        const response = await fetch(`/api/certificate/add?id=${id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        });
        if (response.ok) {
          alert("Certificate deleted successfully");
          setCertificates(certificates.filter((cert) => cert.id !== id));
        } else {
          alert("Failed to delete certificate");
        }
      } catch (error) {
        console.error("Failed to delete certificate:", error);
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <Search placeholder="ค้นหาผู้ใช้..." />
        <Link href="/dashboard/certificate/add">
          <button className={styles.addButton}>Add New</button>
        </Link>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <td>#</td>
            <td>สายพันธุ์</td>
            <td>รหัสแปลงปลูก</td>
            <td>วันจดทะเบียน</td>
            <td>วันหมดอายุ</td>
            <td>สถานะ</td>
            <td>ข้อมูลเกษตรกร</td>
            <td>Actions</td>
          </tr>
        </thead>
        <tbody>
          {certificates.length > 0 ? (
            certificates.map((certificate) => (
              <tr key={certificate.id}>
                <td>{certificate.id}</td>
                <td>{certificate.variety}</td>
                <td>{certificate.plotCode}</td>
                <td>
                  {new Date(certificate.registrationDate).toLocaleDateString()}
                </td>
                <td>{new Date(certificate.expiryDate).toLocaleDateString()}</td>
                <td>
                  <span
                    className={`${styles.status} ${styles[certificate.status]}`}
                  >
                    {certificate.status}
                  </span>
                </td>
                <td>
                  {certificate.farmer?.name || "N/A"}
                  <br />
                  {certificate.farmer?.location || "N/A"}
                </td>
                <td>
                  <div className={styles.buttons}>
                    <Link
                      href={`/dashboard/certificate/edit/${certificate.id}`}
                    >
                      <button className={`${styles.button} ${styles.view}`}>
                        Edit
                      </button>
                    </Link>
                    <button
                      className={`${styles.button} ${styles.cancelled}`}
                      onClick={() => handleDelete(certificate.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={9}>No certificates available</td>
            </tr>
          )}
        </tbody>
      </table>
      <Pagination />
    </div>
  );
};

export default Certificate;
