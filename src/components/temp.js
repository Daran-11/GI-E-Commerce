

//'use client';
/* eslint-disable @next/next/no-img-element */
/*import { useRouter } from 'next/router';
import { useEffect, useState } from "react";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const router = useRouter();
  
  // Fetch the data from database
  const fetchAllData = async (searchQuery) => {
    try {
      const response = await fetch(`https://localhost/api/search?query=${searchQuery}`);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
   // Fetch all data when query is empty
  useEffect(() => {
    const { q } = router.query;
    if (q) {
      setQuery(q);
      fetchAllData(q);
    } else {
      fetchAllData("");
    }
  }, [router.query]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    // Update URL with new search query
    const params = new URLSearchParams(window.location.search);
    if (value) {
      params.set('q', value);
    } else {
      params.delete('q');
    }
    router.push(`/?${params.toString()}`, undefined, { shallow: true });

    // Debounced filtering of suggestions based on user input
    setTimeout(() => {
      fetchAllData(value);
    }, 300); // Adjust debounce time as needed
  };
    // Push the new url
  const handleSuggestionClick = (item) => {
    router.push(item.detailPageUrl);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-lg mx-auto mt-8">
      <div className="relative w-full">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Search"
          className="w-full px-4 py-3 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          aria-label="Search"
        />
        {suggestions.length > 0 && (
          <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-52 overflow-y-auto z-10">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b border-gray-200 bg-gray-100">Image</th>
                  <th className="py-2 px-4 border-b border-gray-200 bg-gray-100">Name</th>
                </tr>
              </thead>
              <tbody>
                {suggestions.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => handleSuggestionClick(item)}
                    className="cursor-pointer hover:bg-gray-100"
                  >

                    <td className="py-2 px-4 border-b border-gray-200">{item.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}*/
