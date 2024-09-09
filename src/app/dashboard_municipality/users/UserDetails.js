'use client';

import { useRouter } from 'next/navigation';
import styles from '../../ui/dashboard/users/UserDetails/userdetails.module.css';

export default function UserDetails({ user }) {
  const router = useRouter();

  const handleApproval = async () => {
    if (confirm('Are you sure you want to approve this user?')) {
      await fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'approve' }),
      });
      router.push('/dashboard_municipality/users');
    }
  };

  const handleRejection = () => {
    router.push('/dashboard_municipality/users');
  };

  return (
    <div className={styles.container}>
      <main className={styles.mainContent}>
        <h1 className={styles['title-name']}>ตรวจสอบข้อมูลผู้ใช้</h1>
        <div className={styles['user-details-section']}>
          <h className="title">ชื่อ</h>
          <div className={styles['data-box']}> {user.title} {user.name} {user.lastname}</div>
          <h className="title">ที่อยู่</h>
          <div className={styles['data-box']}> {user.address}</div>
          <h className="title">ตำบล</h>
          <div className={styles['data-box']}> {user.sub_district}</div>
          <h className="title">อำเภอ</h>
          <div className={styles['data-box']}> {user.district}</div>
          <h className="title">จังหวัด</h>
          <div className={styles['data-box']}> {user.province}</div>
          <h className="title">รหัสไปรษณีย์</h>
          <div className={styles['data-box']}> {user.zip_code}</div>
          <h className="title">เบอร์โทรศัพท์</h>
          <div className={styles['data-box']}> {user.phone}</div>
        </div>

        <div className={styles['button-group']}>
          <button onClick={handleApproval} className={styles['button-submitt']}>Approve</button>
          <button onClick={handleRejection} className={styles['button-submittt']}>Reject</button>
        </div>
      </main>
    </div>
  );
}
