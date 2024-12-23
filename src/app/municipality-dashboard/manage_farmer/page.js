"use client";
import React, { useState, useEffect } from "react";
import styles from "@/app/ui/dashboard/certificate/certificate.module.css";
import Link from "next/link";
import Pagination from "@/app/ui/dashboard/pagination/pagination";
import Search from "@/app/ui/dashboard/search/search";
import { MdEdit, MdDelete } from 'react-icons/md';

const Loading = () => {
 return (
   <div className="flex flex-col items-center justify-center min-h-screen">
     <div className="w-12 h-12 border-4 border-t-green-500 border-r-green-500 border-b-green-200 border-l-green-200 rounded-full animate-spin"></div>
     <p className="mt-4 text-gray-600">กำลังโหลดข้อมูล...</p>
   </div>
 );
};

const ManageFarmer = () => {
 const [manage_farmer, setManage_farmer] = useState([]);
 const [standards, setStandards] = useState({});
 const [currentPage, setCurrentPage] = useState(1);
 const [searchQuery, setSearchQuery] = useState("");
 const itemsPerPage = 10;

 const fetchStandards = async () => {
   try {
     const response = await fetch("/api/standards");
     if (!response.ok) {
       throw new Error('Failed to fetch standards');
     }
     const data = await response.json();
     const standardsMap = {};
     data.forEach(standard => {
       standardsMap[standard.name] = standard.certificationInfo;
     });
     setStandards(standardsMap);
   } catch (error) {
     console.error("Failed to fetch standards:", error);
   }
 };

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
   fetchStandards();
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
         // Check if we need to adjust current page after deletion
         const remainingItems = manage_farmer.length - 1;
         const newMaxPage = Math.ceil(remainingItems / itemsPerPage);
         if (currentPage > newMaxPage) {
           setCurrentPage(newMaxPage);
         }
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

 // ฟังก์ชันจัดการการค้นหา
 const handleSearch = (value) => {
   setSearchQuery(value);
   setCurrentPage(1); // รีเซ็ตกลับไปหน้าแรกเมื่อมีการค้นหา
 };

 // ฟังก์ชันกรองข้อมูล
 const filteredFarmers = manage_farmer.filter((farmer) => {
   const searchLower = searchQuery.toLowerCase();
   return (
     // ค้นหาจากชื่อ-นามสกุล
     farmer.farmerNameApprove.toLowerCase().includes(searchLower) ||
     // ค้นหาจากข้อมูลใบรับรองทั้งหมด
     farmer.certificates.some(cert => 
       cert.type.toLowerCase().includes(searchLower) ||
       cert.variety.toLowerCase().includes(searchLower) ||
       cert.standardName.toLowerCase().includes(searchLower)
     )
   );
 });

 const renderCertificationInfo = (standardName, certificateNumber) => {
   const certInfo = standards[standardName];
   if (!certInfo) return certificateNumber;
   return `${certInfo}: ${certificateNumber}`;
 };

 // Calculate pagination
 const indexOfLastItem = currentPage * itemsPerPage;
 const indexOfFirstItem = indexOfLastItem - itemsPerPage;
 const currentFarmers = filteredFarmers.slice(indexOfFirstItem, indexOfLastItem);
 const totalItems = filteredFarmers.length;

 const handlePageChange = (pageNumber) => {
   setCurrentPage(pageNumber);
 };

 return (
   <div className={styles.container}>
     <h1 className="text-2xl ">ข้อมูลเกษตรกรในระบบ</h1><br></br>
     <div className={styles.top}>
       <Search 
         placeholder="ค้นหาเกษตรกร..." 
         onSearch={handleSearch}
       />
       <Link href="/municipality-dashboard/manage_farmer/add">
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
           <td>ข้อมูลมาตรฐานการรับรองสินค้า</td>
           <td>วันที่อนุมัติ</td>
           <td>การดำเนินการ</td>
         </tr>
       </thead>
       <tbody>
         {currentFarmers.length > 0 ? (
           currentFarmers.map((farmer, index) => (
             <React.Fragment key={farmer.id}>
               <tr>
                 <td>{indexOfFirstItem + index + 1}</td>
                 <td>{farmer.farmerNameApprove}</td>
                 {farmer.certificates.length > 0 ? (
                   <>
                     <td>{farmer.certificates[0].type}</td>
                     <td>{farmer.certificates[0].variety}</td>
                     <td>{farmer.certificates[0].standardName}</td>
                     <td>{renderCertificationInfo(
                       farmer.certificates[0].standardName,
                       farmer.certificates[0].certificateNumber
                     )}</td>
                     <td>{new Date(farmer.certificates[0].approvalDate).toLocaleDateString()}</td>
                   </>
                 ) : (
                   <td colSpan={5}>ไม่มีใบรับรอง</td>
                 )}
                 <td>
                   <div className={styles.standardsContainer}>
                     <div className={styles.buttons}>
                       <Link href={`/municipality-dashboard/manage_farmer/edit/${farmer.id}`}>
                         <button className={`${styles.iconButton} ${styles.edit}`} title="แก้ไข">
                           <MdEdit />
                         </button>
                       </Link>
                       <button
                         className={`${styles.iconButton} ${styles.delete}`}
                         onClick={() => handleDelete(farmer.id)}
                         title="ลบ"
                       >
                         <MdDelete />
                       </button>
                     </div>
                   </div>
                 </td>
               </tr>
               {farmer.certificates.slice(1).map((certificate, certIndex) => (
                 <tr key={certIndex}>
                   <td></td>
                   <td></td>
                   <td>{certificate.type}</td>
                   <td>{certificate.variety}</td>
                   <td>{certificate.standardName}</td>
                   <td>{renderCertificationInfo(
                     certificate.standardName,
                     certificate.certificateNumber
                   )}</td>
                   <td>{new Date(certificate.approvalDate).toLocaleDateString()}</td>
                   <td></td>
                 </tr>
               ))}
             </React.Fragment>
           ))
         ) : (
           <tr>
             <td colSpan={8}>ไม่พบข้อมูล</td>
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

export default ManageFarmer;