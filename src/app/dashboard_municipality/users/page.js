import prisma from '../../lib/prisma';
import Link from 'next/link';
import styles from '../../ui/dashboard/users/users.module.css';

const fetchUsers = async () => {
  return await prisma.farmer.findMany();
};

export default async function UsersPage() {
  const users = await fetchUsers();

  // Filter out users with roles 'เกษตรกร', 'เทศบาล', or 'admin'
  const filteredUsers = users.filter(user => !['เกษตรกร', 'เทศบาล', 'admin'].includes(user.role));

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <Link href="/dashboard_municipality/users/account">
          <button className={styles.addButton}>บัญชีผู้ใช้ ทั้งหมด</button>
        </Link>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            
            <td>#</td>
            <td>ชื่อ-นามสกุล</td>
            <td>ที่อยู่</td>
            <td>ตำบล</td>
            <td>อำเภอ</td>
            <td>จังหวัด</td>
            <td>รหัสไปรษณีย์</td>
            <td>เบอร์โทรศัพท์</td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length > 0 ? (
             filteredUsers.map((user, index) => (
              <tr key={user.id}>
               
               <td>{index + 1}</td>
                <td>{user.title}{user.name}  &nbsp;{user.lastname}</td>
                <td>{user.address}</td>
                <td>{user.sub_district}</td>
                <td>{user.district}</td>
                <td>{user.province}</td>
                <td>{user.zip_code}</td>
                <td>{user.phone}</td>
               
                <td>
                  <Link href={`/dashboard_municipality/users/${user.id}`}>
                    <button className={styles.button}>ตรวจสอบ</button>
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={12}>No users found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
