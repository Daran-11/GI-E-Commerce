'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

const FarmerProfit = () => {
  const [profitData, setProfitData] = useState(null);
  const [error, setError] = useState(null);
  const [timeFrame, setTimeFrame] = useState('monthly'); // Default to weekly
  const { data: session, status } = useSession();
  useEffect(() => {
    // Fetch profit data based on selected time frame (weekly or monthly)
    const fetchProfitData = async () => {
      try {
        const response = await fetch(`/api/farmer-profit?timeFrame=${timeFrame}`);
        if (!response.ok) {
          throw new Error('Failed to fetch profit data');
        }
        const data = await response.json();
        setProfitData(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchProfitData();
  }, [timeFrame]);

  const handleTimeFrameChange = (event) => {
    setTimeFrame(event.target.value);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!profitData) {
    return <div>Loading...</div>;
  }

  return (
    <div className='bg-white w-[40%] p-6'>
      <h2 className='text-2xl'>ผลกำไร ขาดทุน</h2>

      <div>
        <label>เลือกช่วงเวลา </label>
        <select value={timeFrame} onChange={handleTimeFrameChange}>
          <option value="weekly">สัปดาห์</option>
          <option value="monthly">เดือน</option>
        </select>
      </div>

      <h3>จากวันที่: {profitData.startDate} ถึงวันที่: {profitData.endDate}</h3>

      <h3 className='pt-2 text-2xl text-[#4eac14]'>กำไรรวม: {profitData.totalProfit} THB</h3>
    </div>
  );
};

export default FarmerProfit;
