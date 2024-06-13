
const SearchBar = () => {
  return (
    <div className="Searchbar">
      <input
        type="text"
        placeholder="ค้นหา..."
        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        style={{ borderRadius: '15px' }}
      />
    </div>
  );
};

export default SearchBar;