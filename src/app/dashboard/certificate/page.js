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
  const [farmerId, setFarmerId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedFarmerId = localStorage.getItem('farmerId');
    if (storedFarmerId) {
      setFarmerId(storedFarmerId);
    } else {
      console.error("Farmer ID not found in localStorage");
      // Redirect to login page if farmerId is not found
      router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    const fetchCertificates = async () => {
      if (!farmerId) return;

      try {
        const response = await fetch(`/api/certificate/add?farmerId=${farmerId}`);
        const data = await response.json();
        setCertificates(data);
      } catch (error) {
        console.error("Failed to fetch certificates:", error);
      }
    };

    fetchCertificates();
  }, [farmerId]);

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
            <td>Type</td>
            <td>สายพันธุ์</td>
            <td>รหัสแปลงปลูก</td>
            <td>Image</td>
            <td>สถานะ</td>
            <td>ข้อมูลเกษตรกร</td>
            <td>จำนวนผลผลิต</td>
            <td>Actions</td>
          </tr>
        </thead>
        <tbody>
          {certificates.length > 0 ? (
            certificates.map((certificate) => (
              <tr key={certificate.id}>
                <td>{certificate.id}</td>
                <td>{certificate.type}</td>
                <td>{certificate.variety}</td>
                <td>{certificate.plotCode}</td>
                <td>
                  {certificate.hasCertificate && certificate.imageUrl ? (
                    <Image
                      src={certificate.imageUrl}
                      alt="Certificate Image"
                      width={100}
                      height={100}
                    />
                  ) : (
                    "No Image"
                  )}
                </td>
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
                </td>
                <td>{certificate.productionQuantity}</td>
                <td>
                  <div className={styles.buttons}>
                
                    <button
                      className={`${styles.button} ${styles.delete}`}
                      onClick={() => handleDelete(certificate.id)}
                    >
                      ลบใบรับรอง
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6}>ไม่มีใบรับรอง</td>
            </tr>
          )}
        </tbody>
      </table>
      <Pagination />
    </div>
  );
};

export default Certificate;
