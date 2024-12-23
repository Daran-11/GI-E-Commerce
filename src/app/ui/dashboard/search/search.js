"use client"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useState } from "react"
import { MdSearch } from "react-icons/md"
import styles from "./search.module.css"

// Debounce function
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

const Search = ({ placeholder, onSearch }) => {
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
        params.set("query", query);
      } else {
        params.delete("query");
      }
      
      replace(`${pathname}?${params}`);
      
      // เพิ่มการเรียกใช้ onSearch prop
      if (onSearch) {
        onSearch(query);
      }
    }, 300),
    [searchParams, replace, pathname, onSearch]
  );

  // Update query state and call debounced search handler
  const onChange = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    handleSearch(newQuery);
  };

  return (
    <div className="flex items-center gap-2.5 bg-[#F3F3F3] p-2.5 rounded-lg ">
      <MdSearch />
      <input
        type="text"
        placeholder={placeholder}
        className={styles.input}
        onChange={onChange}
        value={query}
      />
    </div>
  )
}

export default Search