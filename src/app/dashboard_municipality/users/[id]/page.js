import prisma from '../../../lib/prisma';
import UserDetails from '../UserDetails';

const fetchUser = async (id) => {
  return await prisma.farmer.findUnique({
    where: { id: Number(id) },
  });
};

export default async function UserDetailsPage({ params }) {
  const { id } = params;
  const user = await fetchUser(id);

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <UserDetails user={user} />
    </div>
  );
}
