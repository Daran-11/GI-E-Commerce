// components/Layout.js
"use client";
import { useSession } from "next-auth/react";
import SessionProvider from '../../components/SessionProvider';
import Navbar from "../ui/dashboard/navbar/navbar";
import Sidebar from "../ui/dashboard/sidebar/farmer/sidebar";
const Layout = ({ children }) => {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";

  return (
    <div>
       <SessionProvider session={session}>
        {/* Navbar at the top */}
        <Navbar session={session}/>

        {/* Sidebar and Main Content */}
        <div className="flex pt-[60px] xl:space-x-[350px]">
          {!isAdmin && <Sidebar />}
          <main className="ml-[330px] flex-1 pr-4">{children}</main>
        </div>        
       </SessionProvider>

    </div>
  );
};

export default Layout;
