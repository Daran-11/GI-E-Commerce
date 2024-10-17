import styles from "./notification.module.css"
import { MdSupervisedUserCircle, MdNotifications } from "react-icons/md";

const Notification = () => {
  return (
    <div className={styles.container}>
         <MdNotifications size={24} color="red" />
         <div className="styles.texts" > 
            <span className="styles.title">แจ้งเตือน</span>
         </div>

    </div>
  )
}

export default Notification