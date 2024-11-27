"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "@/app/ui/dashboard/certificate/certificate.module.css";
import Search from "@/app/ui/dashboard/search/search";
import Pagination from "@/app/ui/dashboard/pagination/pagination";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch('/api/approve_farmer');
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        setUsers(data); // ไม่ต้อง filter แล้วเพราะทำที่ API แล้ว
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  if (loading) {
    return <div className="flex flex-col items-center justify-center min-h-screen">
    <div className="w-12 h-12 border-4 border-t-green-500 border-r-green-500 border-b-green-200 border-l-green-200 rounded-full animate-spin"></div>
    <p className="mt-4 text-gray-600">กำลังโหลดข้อมูล...</p>
  </div>;
  }

  
  if (error) {
    return <div className="text-center text-red-500 p-4">Error: {error}</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.top}>
      <Search placeholder="ค้นหาผู้ใช้..." />
        <Link href="/municipality-dashboard/users/account">
          <span className={styles.addButton}>บัญชีผู้ใช้ ทั้งหมด</span>
        </Link>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <td>#</td>
            <td>อีเมล</td>
            <td>ชื่อ-นามสกุล</td>
            <td>เบอร์โทรศัพท์</td>
            <td>ชื่อเกษตรกร</td>
            <td>สถานะ</td>
            <td>การจัดการ</td>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1}</td>
                <td>{user.email || '-'}</td>
                <td>{user.name || '-'}</td>
                <td>{user.phone || '-'}</td>
                <td>{user.Farmer?.farmerName || '-'}</td>
                <td>
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-semibold
                      ${user.role === 'farmer' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                  >
                    {user.role === 'farmer' ? 'เกษตรกร' : user.role}
                  </span>
                </td>
                <td>
                  <Link href={`/municipality-dashboard/users/${user.id}`}>
                    <span className={`${styles.button} ${styles.checkButton}`}>
                      ตรวจสอบ
                    </span>
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={12} className="text-center">ไม่พบข้อมูลที่รอการอนุมัติ</td>
            </tr>
          )}
        </tbody>
      </table>
      <Pagination />
    </div>
  );
}