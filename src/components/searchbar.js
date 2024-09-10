"use client";
import { usePathname, useRouter } from "next/navigation";
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
      const res = await fetch(
        `http://localhost:3000/api/suggestions?query=${query}`,
      );
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
    console.log("Search form submitted");
    router.push(`/?query=${query}`);
  };

  const handleSuggestionClick = (suggestion) => {
    const queryParts = [
      suggestion.name,
      suggestion.type,
      suggestion.price.toString(),
    ];

    const newQuery = queryParts
      .filter((part) => part)
      .join(" ")
      .trim(); // Join non-empty parts with a space and trim whitespace
    setQuery(newQuery);
    router.push(`/?query=${encodeURIComponent(newQuery)}`);
    setSuggestions([]); // Clear suggestions
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

  return (
    <div>
      <form onSubmit={handleSearch}>
        <div className="flex justify-between">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ลองค้นหา.."
            className="w-full pl-5 pt-2 pb-2 border-2 border-[#d4d4d4] focus:outline-none focus:ring-2 focus:ring-[#4EAC14] focus:border-transparent rounded-3xl"
          />
          <button type="submit" className="search-button pl-2 pr-2">
            <svg
              className="fill-current text-[#4EAC14]"
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#e8eaed"
            >
              <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
            </svg>
          </button>
        </div>
      </form>
      {suggestions.length > 0 && (
        <ul className="absolute mt-1 bg-white border border-gray-200 w-[28%] rounded-3xl">
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
