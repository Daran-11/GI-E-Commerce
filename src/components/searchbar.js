"use client";
import { useSearch } from "@/context/searchcontext";
import { useRouter } from "next/navigation";
import { useState } from "react";
export default function SearchBar() {
  const [query, setQuery] = useState("");
  const { setSearchQuery } = useSearch();
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(query);
    router.push('/');
  };

  return (
    <form onSubmit={handleSearch}>
      <div className="flex justify-between">

        <input
          
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ลองค้นหา. "
          className="w-full pl-5 pt-2 pb-2 border-2 border-[#d4d4d4] focus:outline-none focus:ring-2 focus:ring-[#4EAC14] focus:border-transparent rounded-3xl  "
          
        
        />        



        <button type="submit" className="search-button pl-2 pr-2">
        <svg className="fill-current text-[#4EAC14]" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/></svg>
        </button>          

      
      </div>

    </form>
  );
}