'use client';

import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Profile() {
  const { data: session, status } = useSession()

  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  // When after loading success and have session, show profile
  return (
    status === 'authenticated' && session.user && (
      <div className="  w-full h-fit bg-white p-6 rounded-xl">
          <div className='w-full h-fit'>
            <p className='page-header'>โปรไฟล์</p>
          </div>

          <div className='flex justify-start space-x-8'>
            <div className='bg-gray-200 w-[200px] h-[200px] rounded-xl'>

            </div>
              <div className='flex w-fit h-fit '>

                <div className='w-full h-fit'>
                  <p className=''>ขื่อ <b>{session.user.name}!</b></p>
                  <p>อีเมล {session.user.email}</p>
                  <p>เบอร์โทร: {session.user.phone}</p> 
                  <button
                      onClick={() => signOut({ callbackUrl: '/' })}
                      className="w-[150px] mt-5 bg-red-500 hover:bg-red-700 text-white py-2 rounded"
                      >
                      ออกจากระบบ
                  </button>                     

                </div>
              </div>            
          </div>

        </div>
    )
  )
}