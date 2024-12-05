"use client";
import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import styles from "./chart.module.css";

const siteId = "cri-gi-pineapple-851653706332.asia-southeast1.run.app" // Access the environment variable
const apiKey = "puRJOYBRiOuELk89pRC1Nka8r5OkOcbYJRVJinl3MNf67hewtEG6aHZPyFisgrrk"


const Chart = () => {
  const [data, setData] = useState([]);
  const period = "month";
  const fetchData = async () => {
    try {

      // Fetch timeseries data for visitors
      const visitorsResponse = await fetch(
        `https://plausible.io/api/v1/stats/timeseries?site_id=${siteId}&period=${period}`,
        {
          headers: {
            Authorization: `Bearer ${apiKey}`, // Include this if using a private API key
          },
        }
      );

      if (!visitorsResponse.ok) {
        throw new Error("Failed to fetch data from Plausible.");
      }
      const visitorsResult = await visitorsResponse.json();


      const transformedVisitorsData = visitorsResult.results.map((item) => ({
        date: item.date,
        visitors: item.visitors,
      }));
      // Fetch total page views for the same period
      const pageViewsResponse = await fetch(
        `https://plausible.io/api/v1/stats/timeseries?site_id=${siteId}&period=${period}&metrics=pageviews`,
        {
          headers: {
            Authorization: `Bearer ${apiKey}`, // Include if using a private API
          },
        }
      );

      if (!pageViewsResponse.ok) {
        throw new Error("Failed to fetch page views data.");
      }
      const pageViewsResult = await pageViewsResponse.json();

      // Transform page views data to match visitors data structure
      const transformedPageViewsData = pageViewsResult.results.map((item) => ({
        date: item.date,
        pageviews: item.pageviews || 0,
      }));


      // Merge visitors and page views data
      const mergedData = transformedVisitorsData.map((visitorData) => {
        const correspondingPageView = transformedPageViewsData.find(
          (pageView) => pageView.date === visitorData.date
        );
        return {
          ...visitorData,
          pageviews: correspondingPageView ? correspondingPageView.pageviews : 0,
        };
      });


      setData(mergedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 60000); // Refresh data every 60 seconds

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, []);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>สรุปรายเดือน</h2>
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorPageviews" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4EAC14" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#4EAC14" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="date" tick={{ fill: "#8884d8" }} />
          <YAxis tick={{ fill: "#8884d8" }} />
          <Tooltip
            contentStyle={{ backgroundColor: "#151c2c", borderRadius: "5px" }}
            labelStyle={{ color: "#ffffff" }}
            itemStyle={{ color: "#ffffff" }}
          />
          <Legend verticalAlign="top" height={36} />
          <Area
            type="monotone"
            dataKey="visitors"
            stroke="#8884d8"
            fillOpacity={1}
            fill="url(#colorVisitors)"
            name="Unique Visitors"
          />
          <Area
            type="monotone"
            dataKey="pageviews"
            stroke="#4EAC14"
            fillOpacity={1}
            fill="url(#colorPageviews)"
            name="Page Views"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
