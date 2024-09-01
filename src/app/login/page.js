// app/login/page.js

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './Login.module.css';

export default function Login() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, password }),
      });

      if (response.ok) {
        const data = await response.json();
        
        localStorage.setItem('token', data.token); 
        localStorage.setItem('id', data.id); 
        localStorage.setItem('login', login); 
        localStorage.setItem('name', data.name);
        localStorage.setItem('lastname', data.lastname); 
        localStorage.setItem('role', data.role); 
        localStorage.setItem('farmerId', data.id); 
        
        router.push('/dashboard');
      } else {
        const errorData = await response.json();
        setError(errorData.message);
      }
    } catch (error) {
      setError('เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.imageContainer}>
          <img src="/images/login.png" alt="login" style={{ width: '100%', height: '100%' }} />
        </div>
        <div className={styles.formContainer}>
          <h2 className={styles.heading}>ลงชื่อเข้าใช้</h2>
          <form className={styles.form} onSubmit={handleSubmit}>
            <input type="hidden" name="remember" value="true" />
            <div className="rounded-md shadow-sm -space-y-px">
              <div className={styles.label}>
                <label htmlFor="login" className="sr-only">อีเมลหรือเบอร์โทรศัพท์</label>
                <input
                  id="login"
                  name="login"
                  type="text"
                  required
                  className={`${styles.input} ${styles.inputLogin}`}
                  placeholder="อีเมลหรือเบอร์โทรศัพท์"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                />
              </div>
              <div className={styles.label}>
                <label htmlFor="password" className="sr-only">รหัสผ่าน</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className={`${styles.input} ${styles.inputPassword}`}
                  placeholder="รหัสผ่าน"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && <div className={styles.error}>{error}</div>}

            <button type="submit" className={styles.submitButton}>
              เข้าสู่ระบบ
            </button>

            <div className={styles.separator}>
              <hr />
              <span>หรือ</span>
              <hr />
            </div>
          </form>
          <div className="text-center">
            <Link href="/register" className={styles.submitregister}>
              ลงทะเบียนใหม่
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}