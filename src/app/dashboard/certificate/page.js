"use client";
import { useState, useEffect } from "react";
import styles from "@/app/ui/dashboard/certificate/certificate.module.css";
import Link from "next/link";
import Image from "next/image";
import Pagination from "@/app/ui/dashboard/pagination/pagination";
import Search from "@/app/ui/dashboard/search/search";
import { useRouter } from "next/navigation";

const Certificate = () => {
  const [certificates, setCertificates] = useState([]);
  const [UsersId, setUsersId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedUsersId = localStorage.getItem("UsersId");
    if (storedUsersId) {
      setUsersId(storedUsersId);
    } else {
      console.error("Users ID not found in localStorage");
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    const fetchCertificates = async () => {
      if (!UsersId) return;

      try {
        const response = await fetch(`/api/certificate/add?UsersId=${UsersId}`);
        const data = await response.json();
        setCertificates(data);
      } catch (error) {
        console.error("Failed to fetch certificates:", error);
      }
    };

    fetchCertificates();
  }, [UsersId]);

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
          <button className={styles.addButton}>เพิ่ม ใบรับรอง</button>
        </Link>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <td>#</td>
            <td>ชนิด</td>
            <td>สายพันธุ์</td>
            <td>มาตรฐาน</td>
            <td>จำนวนผลผลิต</td>
            <td>สถานะ</td>
            <td>รายงาน</td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {certificates.length > 0 ? (
            certificates.map((certificate, index) => {
              const standards = JSON.parse(certificate.standards); // Parse standards if needed
              return (
                <tr key={certificate.id}>
                  <td>{index + 1}</td>
                  <td>{certificate.type}</td>
                  <td>{certificate.variety}</td>
                  <td>
                    <div className={styles.standardsContainer}>
                      {standards.length > 0
                        ? standards.map((standard) => (
                            <Image
                              key={standard.id}
                              src={standard.logo}
                              alt={standard.name}
                              width={40}
                              height={40}
                            />
                          ))
                        : "ไม่มี"}
                    </div>
                  </td>

                  <td>{certificate.productionQuantity}</td>
                  <td>
                    <span
                      className={`${styles.status} ${
                        styles[certificate.status]
                      }`}
                    >
                      {certificate.status}
                    </span>
                  </td>
                  <td>
                    {certificate.municipalComment
                      ? certificate.municipalComment
                      : "-"}
                  </td>

                  <td>
                  <div className={styles.standardsContainer}>
                    {certificate.status === "ไม่อนุมัติ" ? (
                      <div className={styles.buttons}>
                        <button
                          className={`${styles.button} ${styles.view}`}
                          onClick={() => handleDelete(certificate.id)}
                        >
                          ลบใบรับรอง
                        </button>
                      </div>
                    ) : (
                      <span></span>
                    )}
                    </div>
                    <div className={styles.buttons}></div>
                  </td>
                </tr>
              );
            })
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

export default Certificate;
