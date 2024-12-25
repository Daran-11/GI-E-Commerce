"use client";
import styles from "@/app/ui/dashboard/certificate/certificate.module.css";
import Pagination from "@/app/ui/dashboard/pagination/pagination";
import Search from "@/app/ui/dashboard/search/search";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MdDelete, MdEdit } from 'react-icons/md';
import { toast } from "react-toastify";

const Loading = () => {
 return (
   <div className="flex flex-col items-center justify-center min-h-screen">
     <div className="w-12 h-12 border-4 border-t-green-500 border-r-green-500 border-b-green-200 border-l-green-200 rounded-full animate-spin"></div>
     <p className="mt-4 text-gray-600">กำลังโหลดข้อมูล...</p>
   </div>
 );
};

const Standards = () => {
 const [standards, setStandards] = useState([]);
 const [currentPage, setCurrentPage] = useState(1);
 const [searchQuery, setSearchQuery] = useState("");
 const itemsPerPage = 10;

 useEffect(() => {
   const fetchStandards = async () => {
     try {
       const response = await fetch("/api/standards");
       const data = await response.json();
       setStandards(data);
     } catch (error) {
       console.error("Failed to fetch standards:", error);
     }
   };

   fetchStandards();
 }, []);

 const handleDelete = async (id) => {
   if (confirm("คุณแน่ใจหรือไม่ว่าต้องการลบมาตรฐานนี้?")) {
     try {
       const response = await fetch(`/api/standards?id=${id}`, {
         method: "DELETE",
       });
       if (response.ok) {
         toast.success("ลบมาตรฐานเรียบร้อยแล้ว");
         setStandards(standards.filter((std) => std.id !== id));
         // Check if we need to go to previous page after deletion
         const newTotalPages = Math.ceil((standards.length - 1) / itemsPerPage);
         if (currentPage > newTotalPages) {
           setCurrentPage(newTotalPages);
         }
       } else {
         toast.error("ไม่สามารถลบมาตรฐานได้");
       }
     } catch (error) {
       console.error("Failed to delete standard:", error);
     }
   }
 };

 // ฟังก์ชันจัดการการค้นหา
 const handleSearch = (value) => {
   setSearchQuery(value);
   setCurrentPage(1); // รีเซ็ตหน้าเมื่อมีการค้นหาใหม่
 };

 // กรองข้อมูลตามการค้นหา
 const filteredStandards = standards.filter((standard) => {
   const searchLower = searchQuery.toLowerCase();
   return (
     standard.name.toLowerCase().includes(searchLower) ||
     standard.certificationInfo.toLowerCase().includes(searchLower)
   );
 });

 // Calculate pagination with filtered data
 const indexOfLastItem = currentPage * itemsPerPage;
 const indexOfFirstItem = indexOfLastItem - itemsPerPage;
 const currentItems = filteredStandards.slice(indexOfFirstItem, indexOfLastItem);
 const totalItems = filteredStandards.length;

 // Handle page change
 const handlePageChange = (pageNumber) => {
   setCurrentPage(pageNumber);
 };

 return (
   <div className={styles.container}>
     <h1 className="text-2xl">จัดการมาตรฐาน</h1><br></br>
     <div className={styles.top}>
       <Search 
         placeholder="ค้นหามาตรฐาน..." 
         onSearch={handleSearch}
       />
       <Link href="/municipality-dashboard/manage_standards/add">
         <button className={styles.addButton}>เพิ่มมาตรฐาน</button>
       </Link>
     </div>
     <table className={styles.table}>
       <thead>
         <tr>
           <td>#</td>
           <td>ชื่อมาตรฐาน</td>
           <td>โลโก้</td>
           <td>ข้อมูลมาตรฐานการรับรองสินค้า</td>
           <td>การดำเนินการ</td>
         </tr>
       </thead>
       <tbody>
         {currentItems.length > 0 ? (
           currentItems.map((standard, index) => (
             <tr key={standard.id}>
               <td>{indexOfFirstItem + index + 1}</td>
               <td>{standard.name}</td>
               <td>
                 <div className={styles.standardsContainer}>
                   <Image
                     src={standard.logoUrl}
                     alt={standard.name}
                     width={50}
                     height={50}
                     className={styles.standardLogo}
                   />
                 </div>
               </td>
               <td>{standard.certificationInfo}</td>
               <td>
                 <div className={styles.standardsContainer}>
                   <div className={styles.buttons}>
                     <Link href={`/municipality-dashboard/manage_standards/edit/${standard.id}`}>
                       <button className={`${styles.iconButton} ${styles.edit}`} title="แก้ไข">
                         <MdEdit />
                       </button>
                     </Link>
                     <button
                       className={`${styles.iconButton} ${styles.delete}`}
                       onClick={() => handleDelete(standard.id)}
                       title="ลบ"
                     >
                       <MdDelete />
                     </button>
                   </div>
                 </div>
               </td>
             </tr>
           ))
         ) : (
           <tr>
             <td colSpan={5}>ไม่พบข้อมูลที่ค้นหา</td>
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

export default Standards;