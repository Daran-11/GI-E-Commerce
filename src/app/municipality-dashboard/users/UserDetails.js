'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

export default function UserDetails({ user: initialUser }) {
  const [user, setUser] = useState(initialUser);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState("");
  const [farmerApproved, setFarmerApproved] = useState(false);
  const router = useRouter();

  const checkFarmerExists = async (farmerName) => {
    try {
      const response = await fetch("/api/manage_farmer");
      const farmers = await response.json();

      const exists = farmers.some(
        farmer => farmer.farmerNameApprove?.toLowerCase() === farmerName?.toLowerCase()
      );
      setFarmerApproved(exists);
    } catch (error) {
      console.error("Error checking farmer:", error);
      setError("ไม่สามารถตรวจสอบข้อมูลเกษตรกรได้");
    }
  };

  const fetchUserDetails = async () => {
    setInitialLoading(true);
    try {
      const response = await fetch(`/api/approve_farmer/${user.id}`);
      const data = await response.json();
      if (response.ok) {
        setUser(data);
        if (data.Farmer?.farmerName) {
          await checkFarmerExists(data.Farmer.farmerName);
        }
      } else {
        setError(data.message || "ไม่สามารถดึงข้อมูลได้");
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      setError("เกิดข้อผิดพลาดในการโหลดข้อมูล");
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, [user.id]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (loading) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [loading]);

  const handleApprove = async () => {
    if (!user.Farmer) {
      toast.error('ไม่พบข้อมูลเกษตรกร');
      return;
    }

    if (!farmerApproved) {
      toast.error('ไม่พบรายชื่อเกษตรกรในฐานข้อมูล');
      return;
    }

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
        toast.success('อนุมัติเกษตรกรเรียบร้อยแล้ว');
        router.push('/municipality-dashboard/users');
        router.refresh();
      } else {
        const data = await response.json();
        throw new Error(data.message || 'เกิดข้อผิดพลาดในการอนุมัติ');
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        <span className="ml-3">กำลังโหลดข้อมูล...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center p-4 rounded-lg bg-red-50 text-red-500">
          ไม่พบข้อมูลผู้ใช้
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">ข้อมูลเกษตรกร</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">ชื่อ-นามสกุล (เกษตรกร):</p>
            <div className="flex items-center space-x-2">
              <p className="font-medium">{user.Farmer?.farmerName || "-"}</p>
              {user.Farmer?.farmerName && (
                <span className={`px-2 py-1 rounded-full text-sm ${farmerApproved
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
                  }`}>
                  {farmerApproved ? 'พบข้อมูลในระบบ' : 'ไม่พบข้อมูลในระบบ'}
                </span>
              )}
            </div>
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

      <div className="flex justify-end space-x-4">
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
        >
          ย้อนกลับ
        </button>
        {user.role === 'customer' && farmerApproved && (
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