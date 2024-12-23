"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { MdEdit, MdDelete } from "react-icons/md";
import styles from "../../ui/dashboard/users/managetype/managetype.module.css";
import Pagination from "@/app/ui/dashboard/pagination/pagination";
import Search from "@/app/ui/dashboard/search/search";

const ManageTypePage = () => {
 const [types, setTypes] = useState([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState(null);
 const [currentPage, setCurrentPage] = useState(1);
 const [searchQuery, setSearchQuery] = useState(""); // เพิ่ม state สำหรับการค้นหา
 const itemsPerPage = 10;

 useEffect(() => {
   fetchTypes();
 }, []);

 const fetchTypes = async () => {
   try {
     setLoading(true);
     const response = await fetch("/api/manage_type");
     if (!response.ok) throw new Error("ไม่สามารถโหลดข้อมูลได้");
     const data = await response.json();
     setTypes(data);
   } catch (err) {
     setError(err.message);
     console.error("Failed to fetch types:", err);
   } finally {
     setLoading(false);
   }
 };

 const handleDelete = async (id) => {
   if (!confirm("คุณต้องการลบข้อมูลนี้ใช่หรือไม่?")) return;

   try {
     const response = await fetch(`/api/manage_type?id=${id}`, {
       method: "DELETE"
     });

     if (!response.ok) throw new Error("ไม่สามารถลบข้อมูลได้");

     setTypes(types.filter(type => type.id !== id));
     
     const remainingItems = types.length - 1;
     const newMaxPage = Math.ceil(remainingItems / itemsPerPage);
     if (currentPage > newMaxPage && newMaxPage > 0) {
       setCurrentPage(newMaxPage);
     }
   } catch (err) {
     setError(err.message);
     console.error("Failed to delete:", err);
   }
 };

 // ฟังก์ชันจัดการการค้นหา
 const handleSearch = (value) => {
   setSearchQuery(value);
   setCurrentPage(1); // รีเซ็ตหน้าเมื่อมีการค้นหาใหม่
 };

 // กรองข้อมูลตามการค้นหา
 const filteredTypes = types.filter((type) => {
   const searchLower = searchQuery.toLowerCase();
   return type.type.toLowerCase().includes(searchLower);
 });

 // Calculate pagination with filtered data
 const indexOfLastItem = currentPage * itemsPerPage;
 const indexOfFirstItem = indexOfLastItem - itemsPerPage;
 const currentTypes = filteredTypes.slice(indexOfFirstItem, indexOfLastItem);
 const totalItems = filteredTypes.length;

 // Handle page change
 const handlePageChange = (pageNumber) => {
   setCurrentPage(pageNumber);
 };

 if (loading) {
   return <div className="flex flex-col items-center justify-center min-h-screen">
     <div className="w-12 h-12 border-4 border-t-green-500 border-r-green-500 border-b-green-200 border-l-green-200 rounded-full animate-spin"></div>
     <p className="mt-4 text-gray-600">กำลังโหลดข้อมูล...</p>
   </div>;
 }

 if (error) {
   return <div className={styles.error}>Error: {error}</div>;
 }

 return (
   <div className={styles.container}>
    <h1 className="text-2xl ">จัดการชนิดของสินค้า</h1><br></br>
     <div className={styles.top}>
       <Search 
         placeholder="ค้นหาชนิดสินค้า..." 
         onSearch={handleSearch}
       />
       <Link href="/municipality-dashboard/manage-type/add">
         <span className={styles.addButton}>เพิ่มชนิดสินค้า</span>
       </Link>
     </div>

     <table className={styles.table}>
       <thead>
         <tr>
           <td>#</td>
           <td>ชนิด</td>
           <td>สายพันธุ์</td>
           <td>วันที่สร้าง</td>
           <td>วันที่อัพเดต</td>
           <td>การจัดการ</td>
         </tr>
       </thead>
       <tbody>
         {currentTypes.length > 0 ? (
           currentTypes.map((type, index) => (
             <tr key={type.id}>
               <td>{indexOfFirstItem + index + 1}</td>
               <td>{type.type}</td>
               <td>
                 <div className={styles.varietyCell}>
                   {type.varieties.map(variety => (
                     <span key={variety.id} className={styles.varietyTag}>
                       {variety.name}
                     </span>
                   ))}
                 </div>
               </td>
               <td>{new Date(type.createdAt).toLocaleDateString('th-TH')}</td>
               <td>{new Date(type.updatedAt).toLocaleDateString('th-TH')}</td>
               <td>
                 <div className={styles.buttons}>
                   <Link href={`/municipality-dashboard/manage-type/edit/${type.id}`}>
                     <button className={styles.editButton}>
                       <MdEdit size={20} />
                     </button>
                   </Link>
                   <button
                     onClick={() => handleDelete(type.id)}
                     className={styles.deleteButton}
                   >
                     <MdDelete size={20} />
                   </button>
                 </div>
               </td>
             </tr>
           ))
         ) : (
           <tr>
             <td colSpan={6} className={styles.noData}>ไม่พบข้อมูลที่ค้นหา</td>
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

export default ManageTypePage;