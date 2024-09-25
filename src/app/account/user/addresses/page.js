'use client'
import AddressManagement from '@/components/AddressManagement';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
export default function page() {

    const { data: session, status } = useSession()
    const router = useRouter()

    useEffect(() => {
        if (status === 'unauthenticated') {
          router.push('/login')
        }
      }, [status, router])

  return (
    <div className='w-full h-screen bg-white rounded-xl p-6'>
      <p className='page-header'> ที่อยู่จัดส่ง</p>
          <AddressManagement/>          
        

        
    </div>
    
  )
}

