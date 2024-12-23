"use client";
import { useState, useEffect } from "react";
import styles from "@/app/ui/dashboard/certificate/certificate.module.css";
import Link from "next/link";
import Pagination from "@/app/ui/dashboard/pagination/pagination";
import Search from "@/app/ui/dashboard/search/search";
import Image from "next/image";

const Historycer = () => {
 const [certificates, setCertificates] = useState([]);
 const [currentPage, setCurrentPage] = useState(1);
 const [searchQuery, setSearchQuery] = useState("");
 const itemsPerPage = 10;

 useEffect(() => {
   const fetchCertificates = async () => {
     try {
       const response = await fetch("/api/histroycer");
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
         
         // Check if we need to adjust current page after deletion
         const remainingItems = certificates.length - 1;
         const newMaxPage = Math.ceil(remainingItems / itemsPerPage);
         if (currentPage > newMaxPage && newMaxPage > 0) {
           setCurrentPage(newMaxPage);
         }
       } else {
         alert("Failed to delete certificate");
       }
     } catch (error) {
       console.error("Failed to delete certificate:", error);
     }
   }
 };

 // ฟังก์ชันจัดการการค้นหา
 const handleSearch = (value) => {
   setSearchQuery(value);
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
 const currentItems = filteredCertificates.slice(indexOfFirstItem, indexOfLastItem);
 const totalItems = filteredCertificates.length;

 // Handle page change
 const handlePageChange = (pageNumber) => {
   setCurrentPage(pageNumber);
 };

 return (
   <div className={styles.container}>
     <h1 className="text-2xl ">ประวัติการรับรอง</h1><br></br>
     <div className={styles.top}>
       <Search 
         placeholder="ค้นหาผู้ใช้..." 
         onSearch={handleSearch}
       />
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
         {currentItems.length > 0 ? (
           currentItems.map((certificate, index) => {
             const standards = JSON.parse(certificate.standards);
             return (
               <tr key={certificate.id}>
                 <td>{indexOfFirstItem + index + 1}</td>
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
                   <div className={styles.standardsContainer}>
                     <div className={styles.buttons}>
                       <Link
                         href={`/municipality-dashboard/certificate/edit/${certificate.id}`}
                       >
                         <button className={`${styles.button} ${styles.view}`}>
                           ดูเพิ่มเติม
                         </button>
                       </Link>
                     </div>
                   </div>
                 </td>
               </tr>
             );
           })
         ) : (
           <tr>
             <td colSpan={7}>ไม่พบข้อมูลที่ค้นหา</td>
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

export default Historycer;