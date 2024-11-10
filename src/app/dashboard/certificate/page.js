"use client";
import styles from "@/app/ui/dashboard/certificate/certificate.module.css";
import Pagination from "@/app/ui/dashboard/pagination/pagination";
import Search from "@/app/ui/dashboard/search/search";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
const Certificate = () => {
  const [certificates, setCertificates] = useState([]);
  const { data: session, status } = useSession();
  const router = useRouter();
  const userId = session.user.id;



  useEffect(() => {
    if (status === 'authenticated' && userId) {
      console.log("authenticated");
      const fetchCertificates = async () => {
        try {
          console.log("User ID being sent to API:", userId);
          const response = await fetch(`/api/certificate/add?UsersId=${userId}`);
          const data = await response.json();
      
          // Log the data structure to understand what you're receiving
          console.log("Fetched data:", data);
      
          // Check if data is an array before accessing .length
          if (Array.isArray(data)) {
            setCertificates(data);
          } else {
            console.error("Fetched data is not an array:", data);
          }
      
        } catch (error) {
          console.error("Failed to fetch certificates:", error);
        }
      };   
        fetchCertificates();
  }


  }, [router , session]);

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
                {Array.isArray(standards) && standards.length > 0
                  ? standards.map((standard, idx) => (
                      <Image
                        key={idx}
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
