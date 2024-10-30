
import Sidebar from "../ui/dashboard/sidebar/admin/sidebar";
import Navbar from "../ui/dashboard/navbar/navbar";

const Layout = ({ children }) => {

  return (
    <div>
      {/* Navbar at the top */}
      <Navbar />

      {/* Sidebar and Main Content */}
      <div className="flex pt-[60px] xl:space-x-[350px]">
        <Sidebar />
        <main className="ml-[330px] flex-1 pr-4">{children}</main>
      </div>
    </div>
  )
}

export default Layout