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
                    {standards.length > 0 ? (
                      standards.map((standard) => (
                        <div key={standard.id}>
                          <Image 
                            src={standard.logo} 
                            alt={standard.name} 
                            width={40} 
                            height={40} 
                          />
                        </div>
                      ))
                    ) : (
                      "ไม่มี"
                    )}
                  </td>
                  <td>{certificate.productionQuantity}</td>
                  <td>
                    <span
                      className={`${styles.status} ${styles[certificate.status]}`}
                    >
                      {certificate.status}
                    </span>
                  </td>
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
              );
            })
          ) : (
            <tr>
              <td colSpan={7}>ไม่มีใบรับรอง</td>
            </tr>
          )}
        </tbody>
      </table>
      <Pagination />
    </div>
  );
};

export default Certificate;
