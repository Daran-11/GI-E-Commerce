// app/account/layout.js
import Sidebar from "@/components/account/sidebar";
import { getServerSession } from "next-auth";
import SessionProvider from '../../components/SessionProvider';
import { authOptions } from "../api/auth/[...nextauth]/route";
export default async function AccountLayoutWrapper({ children }) {

  const session = await getServerSession(authOptions);

    return (

        <div className="w-full md:w-[80%] flex justify-start m-auto mt-[100px] ">
    <SessionProvider session={session}>
        <div className="pr-5">
        <Sidebar session={session}/>           
        </div>
            {children}                             
    </SessionProvider>
        
        </div>

      );
}