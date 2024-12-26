"use server";
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import AddressManagement from '@/components/AddressManagement';
import { getServerSession } from 'next-auth';
export default async function Addresses() {
  const session = await getServerSession(authOptions);
  console.log("session",session)
  return (
    <div className='w-full h-screen bg-white rounded-xl p-6'>
      <p className='page-header'> ที่อยู่จัดส่ง</p>
          <AddressManagement session={session}/>          
        

        
    </div>
    
  )
}

