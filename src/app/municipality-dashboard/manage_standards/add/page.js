"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from '@/app/municipality-dashboard/manage_standards/add/standards.module.css';

export default function AddStandard() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [logo, setLogo] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    if (logo) {
      formData.append('logo', logo);
    }

    try {
      const response = await fetch('/api/standards', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        router.push('/municipality-dashboard/manage_standards');
        router.refresh();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add standard');
      }
    } catch (error) {
      console.error('Error adding standard:', error);
      setError(error.message || 'เกิดข้อผิดพลาดในการเพิ่มมาตรฐาน');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
        <h1 className={styles.title}>เพิ่มมาตรฐาน</h1>
        <h3 className={styles.subtitle}>ข้อมูลมาตรฐานการรับรองสินค้า</h3>
        {error && <p className={styles.errorMessage}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className={styles.formContainer}>
            <div className={styles.formLeft}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="name">ชื่อมาตรฐาน</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className={styles.formInput}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="description">คำอธิบาย</label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={styles.formInput}
                />
              </div>
            </div>
            <div className={styles.formRight}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="logo">โลโก้มาตรฐาน</label>
                <input
                  type="file"
                  id="logo"
                  onChange={handleLogoChange}
                  accept="image/*"
                  className={styles.formInput}
                />
                {previewUrl && (
                  <div className={styles.filePreview}>
                    <Image src={previewUrl} alt="Logo preview" width={100} height={100} unoptimized />
                    <p className={styles.fileInfo}>{logo ? logo.name : 'Current logo'}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className={styles.buttonGroup}>
            <button type="button" onClick={() => router.back()} className={styles.buttonCancel}>
              ยกเลิก
            </button>
            <button type="submit" disabled={isSubmitting} className={styles.buttonSubmit}>
              {isSubmitting ? 'กำลังเพิ่ม...' : 'เพิ่มมาตรฐาน'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}