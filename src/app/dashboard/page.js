import Card from "../ui/dashboard/card/card"
import Chart from "../ui/dashboard/chart/chart"
import styles from "../ui/dashboard/dashboard.module.css"
import Transactions from "../ui/dashboard/transactions/transactions"

const Dashboard = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.main}>
        <div className={styles.cards}>
          <Card />
          <Card />
          <Card />
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