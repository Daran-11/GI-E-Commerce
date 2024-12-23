import prisma from '../../../../../lib/prisma';
import Link from 'next/link';
import styles from '../../../ui/dashboard/users/account/account.module.css';

const fetchUsersByRole = async () => {
  try {
    // ดึงข้อมูลจากตาราง Farmer ที่เชื่อมกับ User
    const farmers = await prisma.farmer.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            createdAt: true,
            updatedAt: true,
          }
        }
      },
      where: {
        user: {
          role: 'farmer' // เปลี่ยนเป็นดึงเฉพาะที่เป็น farmer แล้ว
        }
      },
      orderBy: {
        user: {
          createdAt: 'desc'
        }
      }
    });

    // แปลงข้อมูลให้อยู่ในรูปแบบที่ต้องการ
    return farmers.map(farmer => ({
      id: farmer.user.id,
      name: farmer.user.name,
      email: farmer.user.email,
      phone: farmer.user.phone,
      role: farmer.user.role,
      createdAt: farmer.user.createdAt,
      updatedAt: farmer.user.updatedAt,
      Farmer: {
        farmerName: farmer.farmerName,
        address: farmer.address,
        sub_district: farmer.sub_district,
        district: farmer.district,
        province: farmer.province,
        zip_code: farmer.zip_code,
        phone: farmer.phone,
        contactLine: farmer.contactLine,
      }
    }));
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};

export default async function UsersByRolePage() {
  const users = await fetchUsersByRole();

  return (
    <div className={styles.container}>
    <h1 className="text-2xl ">บัญชีคำขอเป็นเกษตรกรทั้งหมด</h1><br></br>
      <table className={styles.table}>
        <thead>
          <tr>
            <td>#</td>
            <td>อีเมล</td>
            <td>ชื่อเกษตรกร</td>
            <td>เบอร์โทรศัพท์</td>
            <td>วันที่ขออนุมัติ</td>
            <td>การจัดการ</td>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1}</td>
                <td>{user.email || '-'}</td>
                <td>{user.Farmer?.farmerName || '-'}</td>
                <td>{user.phone || '-'}</td>
                <td>{user.createdAt ? new Date(user.createdAt).toLocaleDateString('th-TH') : '-'}</td>
                <td>
                  <Link
                    href={`/municipality-dashboard/users/account/${user.id}`}
                    className={`${styles.button} ${styles.viewButton}`}
                  >
                    ดูเพิ่มเติม
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={10} className="text-center">ไม่พบข้อมูล</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}