"use client"; // Add this line to indicate that this is a Client Component

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./Register.module.css"; // ตรวจสอบเส้นทางให้ถูกต้อง

export default function Register() {
  const [title, setTitle] = useState("");
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [address, setAddress] = useState("");
  const [subDistrict, setSubDistrict] = useState("");
  const [district, setDistrict] = useState("");
  const [province, setProvince] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "title":
        setTitle(value);
        break;
      case "name":
        setName(value);
        break;
      case "lastname":
        setLastname(value);
        break;
      case "address":
        setAddress(value);
        break;
      case "subDistrict":
        setSubDistrict(value);
        break;
      case "district":
        setDistrict(value);
        break;
      case "province":
        setProvince(value);
        break;
      case "zipCode":
        setZipCode(value);
        break;
      case "phone":
        setPhone(value);
        break;
      case "password":
        setPassword(value);
        break;
      case "confirmPassword":
        setConfirmPassword(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (password !== confirmPassword) {
      setError("รหัสผ่านไม่ตรงกัน");
      setLoading(false);
      return;
    }

    if (
      !name ||
      !lastname ||
      !address ||
      !subDistrict ||
      !district ||
      !province ||
      !zipCode ||
      !phone ||
      !password
    ) {
      setError("กรุณากรอกข้อมูลให้ครบ");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          name,
          lastname,
          address,
          subDistrict,
          district,
          province,
          zipCode,
          phone,
          password,
        }),
      });

      if (response.ok) {
        router.push("/login");
      } else {
        const errorData = await response.json();
        setError(errorData.message);
      }
    } catch (error) {
      setError("เกิดข้อผิดพลาดในการลงทะเบียน");
    } finally {
      setLoading(false);
    }
  };  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.imageContainer}>
          <img
            src="/images/login.png"
            alt="login"
            style={{ width: "100%", height: "100%" }}
          />
        </div>
        <div className={styles.formContainer}>
          <h2 className={styles.heading}>ลงทะเบียน</h2>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div className="group-division">
              <div className={styles.row}>
              <div className="title">      
  <div className={styles.label}>

    <p className={styles.sectionName}>คำนำหน้า</p>
    <select
      name="title"
      value={title}
      onChange={handleChange}
      className={styles.formInput}
      required
    >
      <option value="" disabled hidden>-</option>
      <option value="นาย">นาย</option>
      <option value="นาง">นาง</option>
      <option value="นางสาว">นางสาว</option>
    </select>
  </div>
  </div>
  
  <div className={styles.label}>
  
    <p className={styles.sectionName}>ชื่อ</p>
    <input
      id="name"
      name="name"
      type="text"
      required
      className={styles.formInput}
      placeholder="ชื่อ"
      value={name}
      onChange={handleChange}
    />
  
</div>
</div>

              </div>

              <div className={styles.label}>
                <label htmlFor="lastname">นามสกุล</label>
                <input
                  id="lastname"
                  name="lastname"
                  type="text"
                  required
                  className={styles.input}
                  placeholder="นามสกุล"
                  value={lastname}
                  onChange={handleChange}
                />
              </div>

              <div className="group-division">
                <div className={styles.row}>
                  <div className={styles.label}>
                    <label htmlFor="address">ที่อยู่</label>
                    <input
                      id="address"
                      name="address"
                      type="text"
                      required
                      className={styles.input}
                      placeholder="ที่อยู่"
                      value={address}
                      onChange={handleChange}
                    />
                  </div>
                  <div className={styles.label}>
                    <label htmlFor="subDistrict">ตำบล</label>
                    <input
                      id="subDistrict"
                      name="subDistrict"
                      type="text"
                      required
                      className={styles.input}
                      placeholder="ตำบล"
                      value={subDistrict}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="group-division">
                <div className={styles.row}>
                  <div className={styles.label}>
                    <label htmlFor="district">อำเภอ</label>
                    <input
                      id="district"
                      name="district"
                      type="text"
                      required
                      className={styles.input}
                      placeholder="อำเภอ"
                      value={district}
                      onChange={handleChange}
                    />
                  </div>
                  <div className={styles.label}>
                    <label htmlFor="province">จังหวัด</label>
                    <input
                      id="province"
                      name="province"
                      type="text"
                      required
                      className={styles.input}
                      placeholder="จังหวัด"
                      value={province}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="group-division">
                <div className={styles.row}>
                  <div className={styles.label}>
                    <label htmlFor="zipCode">รหัสไปรษณีย์</label>
                    <input
                      id="zipCode"
                      name="zipCode"
                      type="text"
                      required
                      className={styles.input}
                      placeholder="รหัสไปรษณีย์"
                      value={zipCode}
                      onChange={handleChange}
                    />
                  </div>
                  <div className={styles.label}>
                    <label htmlFor="phone">เบอร์โทรศัพท์</label>
                    <input
                      id="phone"
                      name="phone"
                      type="text"
                      required
                      className={styles.input}
                      placeholder="เบอร์โทรศัพท์"
                      value={phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="group-division">
                
                <div className={styles.label}>
                  <label htmlFor="password">รหัสผ่าน</label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className={styles.input}
                    placeholder="รหัสผ่าน"
                    value={password}
                    onChange={handleChange}
                  />
                </div>
                <div className={styles.label}>
                  <label htmlFor="confirmPassword">ยืนยันรหัสผ่าน</label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    className={styles.input}
                    placeholder="ยืนยันรหัสผ่าน"
                    value={confirmPassword}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <div className={styles.buttonContainer}>
              <button type="submit" className={styles.submitButton}>
                ลงทะเบียน
              </button>
              <a href="/login" className={styles.submitregister}>
                เข้าสู่ระบบ
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}