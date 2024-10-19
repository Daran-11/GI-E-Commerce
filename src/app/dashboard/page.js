
import dynamic from "next/dynamic"
import styles from "../ui/dashboard/dashboard.module.css"


const Card = dynamic(() => import("../ui/dashboard/card/card"),
  {
    loading: () => <p>Loading...</p>,
  }
)
const Notification = dynamic(() => import("../ui/dashboard/notification/notification"),
  {
    loading: () => <p>Loading...</p>,
  }
)
const Chart = dynamic(() => import("../ui/dashboard/chart/chart"))
const Transactions = dynamic(() => import("../ui/dashboard/transactions/transactions"))


const Dashboard = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.main}>
        <div className={styles.cards}>
          <Card />
          <Card />
          <Card />
          <Notification />
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