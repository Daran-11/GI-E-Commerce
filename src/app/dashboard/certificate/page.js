"use client";
import styles from "@/app/ui/dashboard/certificate/certificate.module.css";
import Pagination from "@/app/ui/dashboard/pagination/pagination";
import Search from "@/app/ui/dashboard/search/search";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-12 h-12 border-4 border-t-green-500 border-r-green-500 border-b-green-200 border-l-green-200 rounded-full animate-spin"></div>
      <p className="mt-4 text-gray-600">กำลังโหลดข้อมูล...</p>
    </div>
  );
};

const Certificate = () => {
  const [certificates, setCertificates] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { data: session, status } = useSession();
  const router = useRouter();
  const userId = session?.user?.id;
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (status === "authenticated" && userId) {
      console.log("authenticated");
      const fetchCertificates = async () => {
        try {
          console.log("User ID being sent to API:", userId);
          const response = await fetch(
            `/api/certificate/add?UsersId=${userId}`
          );
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
  }, [router, session, userId]);

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this certificate?")) {
      try {
        const response = await fetch(`/api/certificate/add?id=${id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        });
        if (response.ok) {
          toast.success("ลบใบรับรองแล้ว");
          setCertificates(certificates.filter((cert) => cert.id !== id));

          // Check if we need to adjust current page after deletion
          const remainingItems = certificates.length - 1;
          const newMaxPage = Math.ceil(remainingItems / itemsPerPage);
          if (currentPage > newMaxPage && newMaxPage > 0) {
            setCurrentPage(newMaxPage);
          }
        } else {
          toast.error("ไม่สามารถลบใบรับรองได้");
        }
      } catch (error) {
        console.error("Failed to delete certificate:", error);
      }
    }
  };

  // ฟังก์ชันสำหรับจัดการการค้นหา
  const handleSearch = (searchValue) => {
    setSearchQuery(searchValue);
    setCurrentPage(1); // รีเซ็ตหน้าเมื่อมีการค้นหาใหม่
  };

  // กรองข้อมูลตามการค้นหา
  const filteredCertificates = certificates.filter((certificate) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      certificate.type.toLowerCase().includes(searchLower) ||
      certificate.variety.toLowerCase().includes(searchLower)
    );
  });

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCertificates = filteredCertificates.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalItems = filteredCertificates.length;

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // ฟังก์ชันสำหรับจัดการการค้นหา
  const handleSearch = (searchValue) => {
    setSearchQuery(searchValue);
    setCurrentPage(1); // รีเซ็ตหน้าเมื่อมีการค้นหาใหม่
  };

  // กรองข้อมูลตามการค้นหา
  const filteredCertificates = certificates.filter((certificate) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      certificate.type.toLowerCase().includes(searchLower) ||
      certificate.variety.toLowerCase().includes(searchLower)
    );
  });

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCertificates = filteredCertificates.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalItems = filteredCertificates.length;

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className={styles.container}>
      <h1 className="text-2xl ">ลงทะเบียนใบรับรอง</h1>
      <br></br>
      <div className={styles.top}>
        <Search placeholder="ค้นหาใบรับรอง..." onSearch={handleSearch} />
        <Link href="/dashboard/certificate/add">
          <button className={styles.addButton}>เพิ่มใบรับรอง</button>
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
          {currentCertificates.length > 0 ? (
            currentCertificates.map((certificate, index) => {
              const standards = Array.isArray(certificate.standards)
                ? certificate.standards
                : JSON.parse(certificate.standards || "[]");
              return (
                <tr key={certificate.id}>
                  <td>{indexOfFirstItem + index + 1}</td>
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
                      {certificate.status === "ไม่ผ่านการรับรอง" ? (
                        <div className={styles.buttons}>
                          <Link
                            href={`/dashboard/certificate/edit/${certificate.id}`}
                          >
                            <button
                              className={`${styles.button} ${styles.view}`}
                            >
                              แก้ไขใบรับรอง
                            </button>
                          </Link>
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
              <td colSpan={8}>ไม่พบข้อมูลที่ค้นหา</td>
            </tr>
          )}
        </tbody>
      </table>
      <Pagination
        currentPage={currentPage}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default Certificate;
