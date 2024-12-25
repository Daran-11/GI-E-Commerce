"use client";
import styles from '@/app/municipality-dashboard/manage_standards/add/standards.module.css';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function EditStandard({ params }) {
  const [name, setName] = useState('');
  const [certificationInfo, setcertificationInfo] = useState('');
  const [logo, setLogo] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { id } = params;

  useEffect(() => {
    const fetchStandard = async () => {
      try {
        const response = await fetch(`/api/standards?id=${id}`);
        if (response.ok) {
          const data = await response.json();
          setName(data.name);
          setcertificationInfo(data.certificationInfo);
          setPreviewUrl(data.logoUrl);
        } else {
          throw new Error('Failed to fetch standard');
        }
      } catch (error) {
        console.error('Error fetching standard:', error);
        setError('Failed to load standard data');
      }
    };

    fetchStandard();
  }, [id]);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('ไฟล์ต้องมีขนาดไม่เกิน 5MB');
        return;
      }
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
    formData.append('certificationInfo', certificationInfo);
    if (logo) {
      formData.append('logo', logo);
    }

    try {
      const response = await fetch(`/api/standards?id=${id}`, {
        method: 'PUT',
        body: formData,
      });

      if (response.ok) {
        router.push('/municipality-dashboard/manage_standards');
        router.refresh();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update standard');
      }
    } catch (error) {
      console.error('Error updating standard:', error);
      setError(error.message || 'เกิดข้อผิดพลาดในการอัปเดตมาตรฐาน');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
        <h1 className="text-2xl">แก้ไขมาตรฐาน</h1>
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
                <label className={styles.formLabel} htmlFor="certificationInfo">ข้อมูลมาตรฐานการรับรองสินค้า</label>
                <input
                  id="certificationInfo"
                  value={certificationInfo}
                  onChange={(e) => setcertificationInfo(e.target.value)}
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
                    <Image 
                      src={previewUrl} 
                      alt="Logo preview" 
                      width={100} 
                      height={100} 
                      unoptimized // จำเป็นสำหรับ external URLs
                    />
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
              {isSubmitting ? 'กำลังอัปเดต...' : 'อัปเดตข้อมูล'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}