// components/Layout.js
'use client'
import { useSession } from 'next-auth/react';
import Sidebar from "../ui/dashboard/sidebar/farmer/sidebar";

const Layout = ({ children }) => {
  const { data: session } = useSession();

  // Check if the user is an admin
  const isAdmin = session?.user?.role === 'admin';

  return (
    <div className="mt-[90px] xl:space-x-[350px] flex">
      {/* Render Sidebar only if user is not admin */}
      {!isAdmin && <Sidebar />}

      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}

export default Layout;
