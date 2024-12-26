import prisma from '../../../../lib/prisma';

export async function GET() {
 try {
   const users = await prisma.user.findMany({
     where: {
       role: 'customer',
       Farmer: {
         some: {} // แก้จาก isNot: null เป็น some: {}
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
     },
     orderBy: {
       createdAt: 'desc'
     }
   });

   const formattedUsers = users.map(user => ({
     id: user.id,
     email: user.email,
     name: user.name, 
     phone: user.phone,
     role: user.role,
     Farmer: user.Farmer[0] // เนื่องจาก Farmer เป็น array ต้องเลือกตัวแรก
   }));

   return new Response(JSON.stringify(formattedUsers), {
     status: 200,
     headers: {'Content-Type': 'application/json'}
   });

 } catch (error) {
   console.error('Error:', error);
   return new Response(JSON.stringify({
     error: 'Failed to fetch users',
     details: error.message
   }), {
     status: 500 
   });
 }
}