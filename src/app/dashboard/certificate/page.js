import Search from "@/app/ui/dashboard/search/search"
import styles from "@/app/ui/dashboard/certificate/certificate.module.css"
import Link from "next/link"
import Image from "next/image"
import Pagination from "@/app/ui/dashboard/pagination/pagination"

const Certificate = () => {
  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <Search placeholder="ค้นหาผู้ใช้..." />
        <Link href="/dashboard/certificate/add">
          <button className={styles.addButton}>Add New</button>
        </Link>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <td>#</td>
            <td>สายพันธุ์</td>
            <td>รหัสแปลงปลูก</td>
            <td>วันจดทะเบียน</td>
            <td>วันหมดอายุ</td>
            <td>สถานะ</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              1
            </td>
            <td>นางแล</td>
            <td>65B01002</td>
            <td>12/01/2567</td>
            <td>12/01/2569</td>
            <td>
                <span className={`${styles.status} ${styles.done}`}>สำเร็จ</span>
              </td>
            <td>
              <div className={styles.buttons}>
                <Link href="/">
                  <button className={`${styles.button} ${styles.view}`}>ดูเพิ่มเติม</button>
                </Link>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              2
            </td>
            <td>ภูแล</td>
            <td>65B01002</td>
            <td>12/01/2567</td>
            <td>12/01/2569</td>
            <td>
                <span className={`${styles.status} ${styles.cancelled}`}>ไม่อนุมัติ</span>
              </td>
            <td>
              <div className={styles.buttons}>
                <Link href="/">
                  <button className={`${styles.button} ${styles.view}`}>ดูเพิ่มเติม</button>
                </Link>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              3
            </td>
            <td>ภูแล</td>
            <td>65B01002</td>
            <td>12/01/2567</td>
            <td>12/01/2569</td>
            <td>
                <span className={`${styles.status} ${styles.pending}`}>รออนุมัติ</span>
              </td>
            <td>
              <div className={styles.buttons}>
                <Link href="/">
                  <button className={`${styles.button} ${styles.view}`}>ดูเพิ่มเติม</button>
                </Link>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              4
            </td>
            <td>ภูแล</td>
            <td>65B01002</td>
            <td>12/01/2567</td>
            <td>12/01/2569</td>
            <td>
                <span className={`${styles.status} ${styles.expired}`}>หมดอายุ</span>
              </td>
            <td>
              <div className={styles.buttons}>
                <Link href="/">
                  <button className={`${styles.button} ${styles.view}`}>ดูเพิ่มเติม</button>
                </Link>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <Pagination />
    </div>

  )
}

export default Certificate