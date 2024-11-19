import prisma from '../../../../../lib/prisma';
import UserDetails from '../UserDetails';

const fetchUser = async (id) => {
  try {
    const user = await prisma.user.findUnique({
      where: { 
        id: Number(id) 
      },
      include: {
        Farmer: true,
      },
    });
    return user;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

export default async function UserDetailsPage({ params }) {
  try {
    const { id } = params;
    const user = await fetchUser(id);

    if (!user) {
      return (
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center p-4 rounded-lg bg-red-50 text-red-500">
            ไม่พบข้อมูลผู้ใช้
          </div>
        </div>
      );
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <UserDetails user={user} />
      </div>
    );
  } catch (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center p-4 rounded-lg bg-red-50 text-red-500">
          เกิดข้อผิดพลาดในการโหลดข้อมูล: {error.message}
        </div>
      </div>
    );
  }
}