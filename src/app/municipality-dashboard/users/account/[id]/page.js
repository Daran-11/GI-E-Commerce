import prisma from '../../../../../../lib/prisma';
import UserDetails from '../../UserDetails';

export default async function UserDetailsPage({ params }) {
 try {
   const user = await prisma.user.findFirst({
     where: { 
       id: Number(params.id),
       role: 'farmer',
       Farmer: {
         some: {}
       }
     },
     include: {
       Farmer: {
         select: {
           farmerName: true,
           address: true,
           sub_district: true,
           district: true,
           province: true,
           zip_code: true,
           phone: true,
           contactLine: true
         }
       }
     }
   });

   if (!user) {
     return (
       <div className="flex justify-center items-center min-h-screen">
         <div className="text-center p-4 rounded-lg bg-red-50 text-red-500">
           ไม่พบข้อมูลผู้ใช้
         </div>
       </div>
     );
   }

   const formattedUser = {
     ...user,
     Farmer: user.Farmer[0]
   };

   return (
     <div className="container mx-auto px-4 py-8">
       <UserDetails user={formattedUser} />
     </div>
   );
   
 } catch (error) {
   return (
     <div className="flex justify-center items-center min-h-screen">
       <div className="text-center p-4 rounded-lg bg-red-50 text-red-500">
         เกิดข้อผิดพลาดในการโหลดข้อมูล: {error.message}
       </div>
     </div>
   );
 }
}