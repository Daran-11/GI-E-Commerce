'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function UserDetails({ user: initialUser }) {
  const [user, setUser] = useState(initialUser);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchUserDetails = async () => {
    try {
      const response = await fetch(`/api/approve_farmer/${user.id}`);
      const data = await response.json();
      if (response.ok) {
        setUser(data);
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const handleApprove = async () => {
    if (!confirm('คุณต้องการอนุมัติผู้ใช้รายนี้เป็นเกษตรกรใช่หรือไม่?')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/approve_farmer/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        alert('อนุมัติเกษตรกรเรียบร้อยแล้ว');
        router.push('/municipality-dashboard/users');
        router.refresh();
      } else {
        const data = await response.json();
        throw new Error(data.message || 'เกิดข้อผิดพลาดในการอนุมัติ');
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  // ... ส่วนอื่นๆ คงเดิม ...

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">


      {/* ข้อมูลเกษตรกร */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">ข้อมูลเกษตรกร</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">ชื่อ-นามสกุล (เกษตรกร):</p>
            <p className="font-medium">{user.Farmer?.farmerName || "-"}</p>
          </div>
          <div>
            <p className="text-gray-600">Line ID:</p>
            <p className="font-medium">{user.Farmer?.contactLine || "-"}</p>
          </div>
          <div className="col-span-2">
            <p className="text-gray-600">ที่อยู่:</p>
            <p className="font-medium">
              {user.Farmer ? (
                `${user.Farmer.address} ${user.Farmer.sub_district} ${user.Farmer.district} ${user.Farmer.province} ${user.Farmer.zip_code}`
              ) : (
                "-"
              )}
            </p>
          </div>
          <div>
            <p className="text-gray-600">เบอร์โทรศัพท์ (เกษตรกร):</p>
            <p className="font-medium">{user.Farmer?.phone || "-"}</p>
          </div>
        </div>
      </div>

      {/* ปุ่มดำเนินการ */}
      <div className="flex justify-end space-x-4">
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
        >
          ย้อนกลับ
        </button>
        {user.role === 'customer' && (
          <button
            onClick={handleApprove}
            disabled={loading}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-green-300"
          >
            {loading ? 'กำลังดำเนินการ...' : 'อนุมัติเป็นเกษตรกร'}
          </button>
        )}
      </div>
    </div>
  );
}