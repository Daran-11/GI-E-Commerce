import styles from "./pagiation.module.css"

const Pagination = () => {
  return (
    <div className={styles.container}>
        <button className={styles.button} disabled>ก่อนหนา</button>
        <button className={styles.button}>ถัดไป</button>
    </div>
  )
}

export default Pagination