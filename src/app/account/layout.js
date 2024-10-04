// app/account/layout.js
import Sidebar from "@/components/account/sidebar";
export default function AccountLayoutWrapper({ children }) {
    return (

        <div className="w-full md:w-[80%] flex justify-start m-auto mt-[100px] ">
        <div className="pr-5">
        <Sidebar/>           
        </div>
            {children}             

             
            </div>

      );
}