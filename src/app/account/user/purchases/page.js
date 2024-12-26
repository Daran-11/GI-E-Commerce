"use server";
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import PurchasesPageClient from '@/components/PurchasesPageClient';
import { getServerSession } from 'next-auth';

export default async function Purchases() {

  const session = await getServerSession(authOptions);

    return (
      <div className='w-full h-screen bg-white rounded-xl p-6'>
            <PurchasesPageClient session={session}/>          
          
  
       
      </div>
      
    )
  
}

