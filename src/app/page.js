'use client'

import { signOut, useSession } from 'next-auth/react'

export default function Home() {
  const { data: session, status } = useSession()



//ถ้ายังไม่ล็อคอินจะโชว์ปุ่มล็อคอิน ถ้าล็อคอินแล้วจะโชว์ชื่อผู้ใช้
  return (
    <div className="text-black flex items-center justify-center h-screen bg-white">
      
      {status === 'unauthenticated' ? (
        <div className="hover:text-blue-500">
          <a href="/Login">Login click</a>
        </div>
      )

      
      : status === 'authenticated' && session?.user ? (
        <div className="flex h-screen items-center justify-center">
          <div className="bg-white p-6 rounded-md shadow-md">
            <p>
              Welcome, <b>{session.user.name}!</b>
            </p>
            <p>Email: {session.user.email}</p>
            <p>Role: {session.user.role}</p>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="w-full bg-blue-500 text-white py-2 rounded"
            >
              Logout
            </button>
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  )
}
