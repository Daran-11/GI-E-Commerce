'use client'

import { MdSearch } from "react-icons/md"
import styles from "./search.module.css"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"

// Debounce function
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

const Search = ({ placeholder }) => {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  // Initialize the input value with the current search query
  const currentQuery = searchParams.get("query") || "";
  const [query, setQuery] = useState(currentQuery);

  // Debounced search handler
  const handleSearch = useCallback(
    debounce((query) => {
      const params = new URLSearchParams(searchParams);
      
      if (query) {
        // Set the search query
        params.set("query", query);
      } else {
        // Remove the search query if input is empty
        params.delete("query");
      }
      
      replace(`${pathname}?${params}`);
    }, 300), // Adjust delay as needed
    [searchParams, replace, pathname]
  );

  // Update query state and call debounced search handler
  const onChange = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    handleSearch(newQuery);
  };

  return (
    <div className={styles.container}>
      <MdSearch />
      <input 
        type="text" 
        placeholder={placeholder} 
        className={styles.input} 
        onChange={onChange}
        value={query} // Set the current search query as the value
      />
    </div>
  )
}

export default Search
