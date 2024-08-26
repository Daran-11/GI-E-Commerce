'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './Register.module.css'; // ตรวจสอบเส้นทางให้ถูกต้อง

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (password !== confirmPassword) {
      setError('รหัสผ่านไม่ตรงกัน');
      setLoading(false);
      return;
    }

    if (!name || !email || !phone || !password) {
      setError('กรุณากรอกข้อมูลให้ครบ');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password }),
      });

      if (response.ok) {
        router.push('/login');
      } else {
        const errorData = await response.json();
        setError(errorData.message);
      }
    } catch (error) {
      setError('เกิดข้อผิดพลาดในการลงทะเบียน');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.imageContainer}>
          <img src="/images/login.png" alt="login" style={{ width: '100%', height: '100%' }} />
        </div>
        <div className={styles.formContainer}>
          <h2 className={styles.heading}>ลงทะเบียน</h2>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div className={styles.label}>
                <label htmlFor="name">ชื่อ</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className={styles.input}
                  placeholder="ชื่อ"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className={styles.label}>
                <label htmlFor="email">อีเมล</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className={styles.input}
                  placeholder="อีเมล"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className={styles.label}>
                <label htmlFor="phone">เบอร์โทรศัพท์</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  className={styles.input}
                  placeholder="เบอร์โทรศัพท์"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
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
                  onChange={(e) => setPassword(e.target.value)}
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
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.buttonContainer}>
              <button type="submit" className={styles.submitButton} disabled={loading}>
                {loading ? 'กำลังลงทะเบียน...' : 'ลงทะเบียน'}
              </button>
              <Link href="/login" className={styles.submitregister}>
                เข้าสู่ระบบ
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
