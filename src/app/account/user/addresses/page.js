'use client'
import AddressManagement from '@/components/AddressManagement';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

function page() {

    const { data: session, status } = useSession()
    const router = useRouter()

    useEffect(() => {
        if (status === 'unauthenticated') {
          router.push('/login')
        }
      }, [status, router])

  return (
    <div className='top-container'>          
        <AddressManagement/>
    </div>
    
  )
}

export default page