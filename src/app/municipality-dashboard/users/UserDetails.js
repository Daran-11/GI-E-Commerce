'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

export default function UserDetails({ user: initialUser }) {
 const [user, setUser] = useState(initialUser);
 const [loading, setLoading] = useState(false);
 const [farmerApproved, setFarmerApproved] = useState(false);
 const router = useRouter();

 useEffect(() => {
   checkFarmerExists(user.Farmer?.farmerName);
 }, [user.Farmer?.farmerName]);

 const checkFarmerExists = async (farmerName) => {
   if (!farmerName) return;
   try {
     const response = await fetch("/api/manage_farmer");
     const farmers = await response.json();
     setFarmerApproved(farmers.some(
       f => f.farmerNameApprove?.toLowerCase() === farmerName.toLowerCase()
     ));
   } catch (error) {
     toast.error("ไม่สามารถตรวจสอบข้อมูลได้");
   }
 };

 const handleApprove = async () => {
   if (!user.Farmer) {
     toast.error('ไม่พบข้อมูลเกษตรกร');
     return;
   }

   if (!farmerApproved) {
     toast.error('ไม่พบรายชื่อในฐานข้อมูล');
     return;
   }

   if (!confirm('ยืนยันการอนุมัติ?')) return;

   setLoading(true);
   try {
     const response = await fetch(`/api/approve_farmer/${user.id}`, {
       method: 'PUT',
       headers: { 'Content-Type': 'application/json' }
     });

     if (!response.ok) throw new Error('อนุมัติไม่สำเร็จ');
     
     toast.success('อนุมัติสำเร็จ');
     router.push('/municipality-dashboard/users');
     router.refresh();
   } catch (error) {
     toast.error(error.message);
   } finally {
     setLoading(false);
   }
 };

 return (
   <div className="bg-white shadow-lg rounded-lg p-6">
     <h3 className="text-xl font-semibold mb-4">ข้อมูลเกษตรกร</h3>

     <div className="grid grid-cols-2 gap-4 mb-4">
       <div>
         <p className="text-gray-600">ชื่อ-นามสกุล (เกษตรกร):</p>
         <div className="flex items-center space-x-2">
           <p className="font-medium">{user.Farmer?.farmerName || "-"}</p>
           {user.Farmer?.farmerName && (
             <span className={`px-2 py-1 rounded-full text-sm ${
               farmerApproved 
                 ? 'bg-green-100 text-green-800' 
                 : 'bg-red-100 text-red-800'
             }`}>
               {farmerApproved ? 'พบข้อมูลในระบบ' : 'ไม่พบข้อมูลในระบบ'}
             </span>
           )}
         </div>
       </div>

       <div>
         <p className="text-gray-600">Line ID:</p>
         <p className="font-medium">{user.Farmer?.contactLine || "-"}</p>
       </div>

       <div className="col-span-2">
         <p className="text-gray-600">ที่อยู่:</p>
         <p className="font-medium">
           {user.Farmer ? (
             `${user.Farmer.address} ${user.Farmer.sub_district} ${user.Farmer.district} ${user.Farmer.province} ${user.Farmer.zip_code}`
           ) : (
             "-"
           )}
         </p>
       </div>

       <div>
         <p className="text-gray-600">เบอร์โทรศัพท์ (เกษตรกร):</p>
         <p className="font-medium">{user.Farmer?.phone || "-"}</p>
       </div>
     </div>

     <div className="flex justify-end space-x-4">
       <button
         onClick={() => router.back()}
         className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
       >
         ย้อนกลับ
       </button>

       {user.role === 'customer' && farmerApproved && (
         <button
           onClick={handleApprove}
           disabled={loading}
           className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-green-300"
         >
           {loading ? 'กำลังดำเนินการ...' : 'อนุมัติเป็นเกษตรกร'}
         </button>
       )}
     </div>
   </div>
 );
}