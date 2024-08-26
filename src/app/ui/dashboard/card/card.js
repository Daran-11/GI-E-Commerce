import { MdSupervisedUserCircle } from "react-icons/md"
import styles from "./card.module.css"

const card = () => {
  return (
    <div className={styles.container}>
      <MdSupervisedUserCircle size={24} />
      <div className={styles.texts}>
        <span className={styles.title}>ยอดผู้เข้าชม</span>
        <span className={styles.number}>10,234</span>
        <span className={styles.detail}>
          <span className={styles.positive}>12%</span> มากกว่าสัปดาห์ก่อน </span>
      </div>
    </div>
  )
}

export default card