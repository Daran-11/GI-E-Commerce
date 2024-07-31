
import Image from "next/image"
import styles from "./transactions.module.css"

const transactions = () => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>ธุรกรรมล่าสุด</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <td>ชื่อ</td>
            <td>สถานะ</td>
            <td>วันที่</td>
            <td>จำนวน</td>
          </tr>
        </thead>
        <tbody>
          <tr>
              <td>
            <div className={styles.user}>
                <Image src="/noavatar.png" alt="" width={40} height={40} className={styles.userImage} />
              ธนธร เต็มสิริมงคล
            </div>
              </td>
            <td>
              <span className={`${styles.status} ${styles.pending}`}>รอดำเนินการ
              </span>
            </td>
            <td>
              14.02.2024
            </td>
            <td>
              $300
            </td>
          </tr>
          <tr>
              <td>
            <div className={styles.user}>
                <Image src="/noavatar.png" alt="" width={40} height={40} className={styles.userImage} />
              ธนธร เต็มสิริมงคล
            </div>
              </td>
            <td>
              <span className={`${styles.status} ${styles.done}`}>สำเร็จ
              </span>
            </td>
            <td>
              14.02.2024
            </td>
            <td>
              $300
            </td>
          </tr>
          <tr>
              <td>
            <div className={styles.user}>
                <Image src="/noavatar.png" alt="" width={40} height={40} className={styles.userImage} />
              ธนธร เต็มสิริมงคล
            </div>
              </td>
            <td>
              <span className={`${styles.status} ${styles.cancelled}`}>ยกเลิก
              </span>
            </td>
            <td>
              14.02.2024
            </td>
            <td>
              $300
            </td>
          </tr>
          <tr>
              <td>
            <div className={styles.user}>
                <Image src="/noavatar.png" alt="" width={40} height={40} className={styles.userImage} />
              ธนธร เต็มสิริมงคล
            </div>
              </td>
            <td>
              <span className={`${styles.status} ${styles.pending}`}>รอดำเนินการ
              </span>
            </td>
            <td>
              14.02.2024
            </td>
            <td>
              $300
            </td>
          </tr>
        
        </tbody>
      </table>
    </div>
  )
}

export default transactions