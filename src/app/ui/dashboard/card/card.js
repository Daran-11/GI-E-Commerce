"use client"
import React, { useEffect, useState } from "react";
import { MdSupervisedUserCircle } from "react-icons/md";
import styles from "./card.module.css";

const siteId = process.env.NEXT_PUBLIC_PLAUSIBLE_SITE_ID;
const apiKey = process.env.NEXT_PUBLIC_PLAUSIBLE_API_KEY;


const Card = () => {
  const [pageViews, setPageViews] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPageViews = async () => {
    try {
      const period = "7d";

      // Fetch page views data for the specified period
      const response = await fetch(
        `https://plausible.io/api/v1/stats/aggregate?site_id=${siteId}&period=${period}&metrics=pageviews`,
        {
          headers: {
            Authorization: `Bearer ${apiKey}`, // Include this if using a private API key
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch page views data.");
      }

      const result = await response.json();

      // Attempt to extract the pageviews count
      // If the API response contains nested objects, adapt this as necessary
      const pageViewsCount =
        typeof result?.results?.pageviews === "object"
          ? Object.values(result.results.pageviews)[0] // Extract the first value from the object
          : result?.results?.pageviews || result?.pageviews || 0;

      // Ensure the extracted value is a number
      setPageViews(Number(pageViewsCount) || 0);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching page views:", error);
      setError("Failed to load page views.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPageViews();
  }, []);

  return (
    <div className={styles.container}>
      <MdSupervisedUserCircle size={24} />
      <div className={styles.texts}>
        <span className={styles.title}>ยอดผู้เข้าชม</span>
        {loading ? (
          <span className={styles.number}>Loading...</span>
        ) : error ? (
          <span className={styles.number}>{error}</span>
        ) : (
          <span className={styles.number}>{pageViews.toLocaleString()}</span>
        )}
        <span className={styles.detail}>
          <span className={styles.positive}>12%</span> มากกว่าสัปดาห์ก่อน
        </span>
      </div>
    </div>
  );
};

export default Card;
