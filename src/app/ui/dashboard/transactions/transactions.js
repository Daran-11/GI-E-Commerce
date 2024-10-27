'use client'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import styles from "./transactions.module.css";

import { useEffect, useState } from 'react';

const data = [
  { name: 'Page A', uv: 4000, pv: 2400, amt: 2400 },
  { name: 'Page B', uv: 3000, pv: 1398, amt: 2210 },
  { name: 'Page C', uv: 2000, pv: 9800, amt: 2290 },
  { name: 'Page D', uv: 2780, pv: 3908, amt: 2000 },
  { name: 'Page E', uv: 1890, pv: 4800, amt: 2181 },
  { name: 'Page F', uv: 2390, pv: 3800, amt: 2500 },
  { name: 'Page G', uv: 3490, pv: 4300, amt: 2100 },
  
];

const Transactions = () => {

  const [charges, setCharges] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCharges = async () => {
      try {
        const response = await fetch('/api/charges');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setCharges(data.data); // เปลี่ยน data.data ขึ้นอยู่กับโครงสร้างที่ Omise ส่งกลับ
      } catch (error) {
        setError(error.message);
      }
    };

    fetchCharges();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>ธุรกรรมล่าสุด</h2>
      <div className={styles.chart}>
      <table className="min-w-full border-collapse border border-gray-200">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">Charge ID</th>
            <th className="border border-gray-300 p-2">Description</th>
            <th className="border border-gray-300 p-2">Amount</th>
            <th className="border border-gray-300 p-2">Currency</th>
            <th className="border border-gray-300 p-2">Created At</th>
          </tr>
        </thead>
        <tbody>
          {charges.length > 0 ? (
            charges.map((charge) => (
              <tr key={charge.id}>
                <td className="border border-gray-300 p-2">{charge.id}</td>
                <td className="border border-gray-300 p-2">{charge.description}</td>
                <td className="border border-gray-300 p-2">{charge.amount / 100} {charge.currency}</td>
                <td className="border border-gray-300 p-2">{charge.currency}</td>
                <td className="border border-gray-300 p-2">{new Date(charge.created_at).toLocaleDateString('th-TH', {
          year: '2-digit',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="border border-gray-300 p-2 text-center">
                No charges available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4EAC14" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#4EAC14" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip contentStyle={{ background: "#151c2c", border: "none" }} />
            <Area type="monotone" dataKey="uv" stroke="#8884d8" fillOpacity={1} fill="url(#colorUv)" />
            <Area type="monotone" dataKey="pv" stroke="#4EAC14" fillOpacity={1} fill="url(#colorPv)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Transactions;
