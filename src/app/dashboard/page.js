
import dynamic from "next/dynamic"
import styles from "../ui/dashboard/dashboard.module.css"


const Card = dynamic(() => import("../ui/dashboard/card/card"),
  {
    loading: () => <div className="flex flex-col items-center justify-center min-h-screen">
    <div className="w-12 h-12 border-4 border-t-green-500 border-r-green-500 border-b-green-200 border-l-green-200 rounded-full animate-spin"></div>
    <p className="mt-4 text-gray-600">กำลังโหลดข้อมูล...</p>
  </div>,
  }
)

const Chart = dynamic(() => import("../ui/dashboard/chart/chart"))
const Transactions = dynamic(() => import("../ui/dashboard/transactions/transactions"))
const FarmerProfit = dynamic(() => import("../../components/FarmerProfit"))

const Dashboard = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.main}>
        <div className={styles.cards}>
        <FarmerProfit/>

          <Card />
        </div>
        <div>
          <Transactions />
        </div>
        <Chart />
      </div>
    </div>
  )
}

export default Dashboard