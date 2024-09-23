'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from "react";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const searchBarRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (query) {
      fetchSuggestions(query);
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const fetchSuggestions = async (query) => {
    try {
      const res = await fetch(`http://localhost:3000/api/suggestions?query=${query}`);
      if (res.ok) {
        const data = await res.json();
        setSuggestions(data.suggestions);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error("Failed to fetch suggestions:", error);
      setSuggestions([]);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    router.push(`/?query=${query}`); 
  };

  const handleSuggestionClick = (suggestion) => {
    const queryParts = [
      suggestion.name,
      suggestion.type,
      suggestion.price.toString(),
    ];

    const newQuery = queryParts.filter(part => part).join(' ').trim();
    setQuery(newQuery);
    router.push(`/?query=${encodeURIComponent(newQuery)}`);
    setSuggestions([]);
  };

  useEffect(() => {
    setQuery(""); // Clear the search input when the path changes
  }, [pathname]);

  const handleClickOutside = (e) => {
    if (searchBarRef.current && !searchBarRef.current.contains(e.target)) {
      setSuggestions([]);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // New: Clear search query
  const clearQuery = () => {

    setQuery('');
    setSuggestions([]); // Clear suggestions
    router.push(`/?query=`); 
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <div className="relative w-full h-full flex items-center">
          {/* Search Input */}
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ลองค้นหา...สับปะรด "
            className="w-full pl-5 pt-2 pb-2 border-2 border-[#d4d4d4] focus:outline-none focus:ring-2 focus:ring-[#4EAC14] focus:border-transparent rounded-3xl"
          />
          {/* Search Button */}
          <button type="submit" className="absolute border-l-2 right-2 pl-2 pr-2">
            <svg className="fill-current text-[#4EAC14]" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
              <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/>
            </svg>
          </button>

          {/* Clear Button */}
          {query && (
            <button
              type="button"
              onClick={clearQuery }
              className="absolute right-14 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" height="29px" viewBox="0 0 24 24" width="29px" fill="currentColor">
                <path d="M0 0h24v24H0z" fill="none" />
                <path d="M18.3 5.71a.996.996 0 00-1.41 0L12 10.59 7.11 5.7a.996.996 0 10-1.41 1.41L10.59 12l-4.88 4.88a.996.996 0 101.41 1.41L12 13.41l4.88 4.88a.996.996 0 101.41-1.41L13.41 12l4.88-4.88a.996.996 0 000-1.41z" />
              </svg>
            </button>
          )}
        </div>
      </form>
      {/* Suggestions */}
      {suggestions.length > 0 && (
        <ul className="absolute mt-1 bg-white border border-gray-200 w-[80%]  md:w-[25%] rounded-3xl">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="cursor-pointer pl-5 py-2 hover:bg-gray-100 rounded-3xl text-gray-500"
              ref={searchBarRef}
            >
              {suggestion.name} ({suggestion.type}) {suggestion.price} ฿
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
