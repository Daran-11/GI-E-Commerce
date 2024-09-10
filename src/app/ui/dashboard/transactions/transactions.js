"use client";
import React from "react";
import Image from "next/image";
import styles from "./transactions.module.css";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Page A", uv: 4000, pv: 2400, amt: 2400 },
  { name: "Page B", uv: 3000, pv: 1398, amt: 2210 },
  { name: "Page C", uv: 2000, pv: 9800, amt: 2290 },
  { name: "Page D", uv: 2780, pv: 3908, amt: 2000 },
  { name: "Page E", uv: 1890, pv: 4800, amt: 2181 },
  { name: "Page F", uv: 2390, pv: 3800, amt: 2500 },
  { name: "Page G", uv: 3490, pv: 4300, amt: 2100 },
];

const Transactions = () => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>ธุรกรรมล่าสุด</h2>
      <div className={styles.chart}>
        <table className={styles.table}>
          <thead>
            <tr>
              <td>ชื่อ</td>
              <td>สถานะ</td>
              <td>วันที่</td>
              <td>จำนวน</td>
            </tr>
          </thead>
        <tbody>
            <tr>
              <td>
                <div className={styles.user}>
                  <Image
                    src="/noavatar.png"
                    alt=""
                    width={40}
                    height={40}
                    className={styles.userImage}
                  />
                  ธนธร เต็มสิริมงคล
                </div>
              </td>
              <td>
                <span className={`${styles.status} ${styles.pending}`}>
                  รอดำเนินการ
                </span>
              </td>
              <td>14.02.2024</td>
              <td>$300</td>
            </tr>
            <tr>
              <td>
                <div className={styles.user}>
                  <Image
                    src="/noavatar.png"
                    alt=""
                    width={40}
                    height={40}
                    className={styles.userImage}
                  />
                  ธนธร เต็มสิริมงคล
                </div>
              </td>
              <td>
                <span className={`${styles.status} ${styles.done}`}>
                  สำเร็จ
                </span>
              </td>
              <td>14.02.2024</td>
              <td>$300</td>
            </tr>
            <tr>
              <td>
                <div className={styles.user}>
                  <Image
                    src="/noavatar.png"
                    alt=""
                    width={40}
                    height={40}
                    className={styles.userImage}
                  />
                  ธนธร เต็มสิริมงคล
                </div>
              </td>
              <td>
                <span className={`${styles.status} ${styles.cancelled}`}>
                  ยกเลิก
                </span>
              </td>
              <td>14.02.2024</td>
              <td>$300</td>
            </tr>
            <tr>
              <td>
                <div className={styles.user}>
                  <Image
                    src="/noavatar.png"
                    alt=""
                    width={40}
                    height={40}
                    className={styles.userImage}
                  />
                  ธนธร เต็มสิริมงคล
                </div>
              </td>
              <td>
                <span className={`${styles.status} ${styles.pending}`}>
                  รอดำเนินการ
                </span>
              </td>
              <td>14.02.2024</td>
              <td>$300</td>
            </tr>
        </tbody>
        </table>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
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
            <Area
              type="monotone"
              dataKey="uv"
              stroke="#8884d8"
              fillOpacity={1}
              fill="url(#colorUv)"
            />
            <Area
              type="monotone"
              dataKey="pv"
              stroke="#4EAC14"
              fillOpacity={1}
              fill="url(#colorPv)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Transactions;
