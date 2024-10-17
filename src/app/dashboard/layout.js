import Sidebar from "../ui/dashboard/sidebar/sidebar"

const Layout = ({children}) => {
  return (
    <div className=" mt-[90px] xl:space-x-[350px]">

            <Sidebar />

        <div className="">
        {children}
        </div>
    </div>
  )
}

export default Layout