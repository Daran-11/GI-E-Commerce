import prisma from '../../../lib/prisma';
import Link from 'next/link';
import styles from '../../../ui/dashboard/users/account/account.module.css';

const fetchUsersByRole = async () => {
  return await prisma.farmer.findMany({
    where: {
      role: {
        in: ['เกษตรกร'],
      },
    },
  });
};

export default async function UsersByRolePage() {
  const users = await fetchUsersByRole();

  return (
    <div className={styles.container}>
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
  {users.length > 0 ? (
    users.map((user, index) => (
      <tr key={user.id}>
        {/* Display the index number, starting from 1 */}
        <td>{index + 1}</td>
        <td>{user.title} {user.name} {user.lastname}</td>
        <td>{user.address}</td>
        <td>{user.sub_district}</td>
        <td>{user.district}</td>
        <td>{user.province}</td>
        <td>{user.zip_code}</td>
        <td>{user.phone}</td>
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
