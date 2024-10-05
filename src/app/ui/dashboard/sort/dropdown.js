'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './sort.module.css'; // Create a CSS module for styling if needed

const SortSelect = ({ currentSortOrder }) => {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const [selectedSortOrder, setSelectedSortOrder] = useState(currentSortOrder);

  const handleSortChange = (e) => {
    const newSortOrder = e.target.value;
    
    // Update local state for the selected sort order
    setSelectedSortOrder(newSortOrder);
    
    // Create a new URLSearchParams object based on existing searchParams
    const params = new URLSearchParams(searchParams.toString());
    
    // Set the new sortOrder value
    params.set("sortOrder", newSortOrder);
    
    // Generate the new URL with updated query parameters
    const newUrl = `?${params.toString()}`;
    
    // Replace the current URL with the new one
    replace(newUrl);
  };

  return (
    <select
      value={selectedSortOrder}
      onChange={handleSortChange}
      className={styles.sortSelect}
    >
      <option value="asc">เรียงจากใหม่ที่สุด</option>
      <option value="desc">เรียงจากเก่าที่สุด</option>
    </select>
  );
};

export default SortSelect;
