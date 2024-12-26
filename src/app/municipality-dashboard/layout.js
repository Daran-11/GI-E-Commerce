// components/Layout.js
"use server";
import { getServerSession } from "next-auth";
import SessionProvider from '../../components/SessionProvider';
import { authOptions } from "../api/auth/[...nextauth]/route";
import Navbar from "../ui/dashboard/navbar/navbar";
import Sidebar from "../ui/dashboard/sidebar/sidebarMunicipality/sidebar";

export default async function Layout({ children }) {
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.role === "admin";

  return (
    <div>
        <SessionProvider session={session}>
            {/* Navbar at the top */}
            <Navbar session={session}/>
            {/* Sidebar and Main Content */}
            <div className="flex pt-[60px] xl:space-x-[350px]">
              {!isAdmin && <Sidebar />}
              <main className="ml-[330px] flex-1 pr-4">
                {children}
              </main>
            </div>            
        </SessionProvider>
    </div>
  );
};

