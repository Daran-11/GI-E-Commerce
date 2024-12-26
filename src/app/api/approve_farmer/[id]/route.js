import prisma from '../../../../../lib/prisma';

export async function GET(request, { params }) {
 try {
   const user = await prisma.user.findFirst({
     where: { 
       id: Number(params.id),
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
     return new Response(JSON.stringify({ message: 'ไม่พบข้อมูล' }), {
       status: 404,
       headers: { 'Content-Type': 'application/json' }
     });
   }

   const formattedUser = {
     id: user.id,
     email: user.email,
     name: user.name,
     phone: user.phone,
     role: user.role,
     Farmer: user.Farmer[0]
   };

   return new Response(JSON.stringify(formattedUser), {
     status: 200,
     headers: { 'Content-Type': 'application/json' }
   });

 } catch (error) {
   console.error('Error:', error);
   return new Response(JSON.stringify({
     message: 'เกิดข้อผิดพลาด',
     error: error.message
   }), {
     status: 500,
     headers: { 'Content-Type': 'application/json' }
   });
 }
}

export async function PUT(request, { params }) {
 try {
   const user = await prisma.user.update({
     where: {
       id: Number(params.id)
     },
     data: {
       role: 'farmer'
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

   const formattedUser = {
     id: user.id,
     email: user.email,
     name: user.name,
     phone: user.phone,
     role: user.role,
     Farmer: user.Farmer[0]
   };

   return new Response(JSON.stringify(formattedUser), {
     status: 200,
     headers: { 'Content-Type': 'application/json' }
   });

 } catch (error) {
   console.error('Error:', error);
   return new Response(JSON.stringify({
     message: 'เกิดข้อผิดพลาด',
     error: error.message
   }), {
     status: 500,
     headers: { 'Content-Type': 'application/json' }
   });
 }
}