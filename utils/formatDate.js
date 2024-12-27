import { useEffect, useState } from 'react';

const DateComponent = ({ date }) => {
  const [formattedDate, setFormattedDate] = useState(null); // ใช้ state เพื่อเก็บวันที่ที่แปลงแล้ว

  useEffect(() => {
    const thaiFormattedDate = formatDateToThaiBuddhist(date); // ฟังก์ชันที่จะทำการแปลงวันที่
    setFormattedDate(thaiFormattedDate); // เซ็ตค่าที่แปลงแล้ว
  }, [date]);

  if (formattedDate === null) {
    return <div>กำลังโหลด..</div>; // จะแสดงข้อความขณะกำลังโหลดวันที่
  }

  return (
    <div>
      <p>{formattedDate}</p> {/* แสดงวันที่ที่แปลงแล้ว */}
    </div>
  );
};

function formatDateToThaiBuddhist(date) {
  const thaiYearOffset = 543;
  const dateObj = new Date(date);
  const year = dateObj.getFullYear() + thaiYearOffset;
  const day = dateObj.toLocaleString('default', { day: 'numeric' });

  const monthMapping = {
    'Jan': 'ม.ค.',
    'Feb': 'ก.พ.',
    'Mar': 'มี.ค.',
    'Apr': 'เม.ย.',
    'May': 'พ.ค.',
    'Jun': 'มิ.ย.',
    'Jul': 'ก.ค.',
    'Aug': 'ส.ค.',
    'Sep': 'ก.ย.',
    'Oct': 'ต.ค.',
    'Nov': 'พ.ย.',
    'Dec': 'ธ.ค.'
  };

  const month = dateObj.toLocaleString('default', { month: 'short' });
  const thaiMonth = monthMapping[month];

  return `${day}/${thaiMonth}/${year}`;
}

export default DateComponent;
