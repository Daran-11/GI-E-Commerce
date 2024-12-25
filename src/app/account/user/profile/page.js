'use client';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Profile() {
  const router = useRouter();
  const [session, setSession] = useState(null);

  // Fetch session data on the client-side
  useEffect(() => {
    const fetchSession = async () => {
      const res = await fetch('/api/auth/session');
      const sessionData = await res.json();
      if (!sessionData) {
        // If no session, redirect to login
        router.push('/login');
      } else {
        setSession(sessionData);
      }
    };

    fetchSession();
  }, [router]);

  if (!session) {
    return <p>Loading...</p>;
  }

  return (
    <div className="w-full h-fit bg-white p-6 rounded-xl">
      <div className="w-full h-fit">
        <p className="page-header">โปรไฟล์</p>
      </div>

      <div className="flex justify-start space-x-8">
        <div className="bg-gray-200 w-[200px] h-[200px] rounded-xl">
          {/* Profile image or other info */}
        </div>
        <div className="flex w-fit h-fit">
          <div className="w-full h-fit">
            <p>ขื่อ <b>{session.user.name}!</b></p>
            <p>อีเมล {session.user.email}</p>
            <p>เบอร์โทร: {session.user.phone || 'กำลังโหลดข้อมูล...'}</p>
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
  );
}
