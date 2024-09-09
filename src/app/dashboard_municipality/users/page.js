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
          <button className={styles.addButton}>ผู้ใช้ที่ได้รับอนุมัติ</button>
        </Link>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            
            <th>#</th>
            <th>ชื่อ-นามสกุล</th>
            <th>ที่อยู่</th>
            <th>ตำบล</th>
            <th>อำเภอ</th>
            <th>จังหวัด</th>
            <th>รหัสไปรษณีย์</th>
            <th>เบอร์โทรศัพท์</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length > 0 ? (
             filteredUsers.map((user, index) => (
              <tr key={user.id}>
               
               <td>{index + 1}</td>
                <td>{user.title} {user.name} {user.lastname}</td>
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
