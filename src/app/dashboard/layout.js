// components/Layout.js
"use client";
import { useSession } from "next-auth/react";
import Sidebar from "../ui/dashboard/sidebar/farmer/sidebar";
import Navbar from "../ui/dashboard/navbar/navbar";

const Layout = ({ children }) => {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";

  return (
    <div>
      {/* Navbar at the top */}
      <Navbar />

      {/* Sidebar and Main Content */}
      <div className="flex pt-[60px] xl:space-x-[350px]">
        {!isAdmin && <Sidebar />}
        <main className="ml-[330px] flex-1 pr-4">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
