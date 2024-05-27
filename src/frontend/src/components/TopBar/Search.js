import { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";

export default function Search() {
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleDynamicSearch = (event) => {
    const result = event.target.value;
    setSearchQuery(result); // save to use for search button
    if (!result.startsWith("#") && result.length > 0) handleSearch(result);
    else setSearchResults([]);
  };

  const handleTagSearch = async () => {
    if (searchQuery === "" || !searchQuery.trim().startsWith("#")) {
      alert("Please write your tag in the search bar");
      return;
    }

    const tags = searchQuery
      .split(" ")
      .map((tag) => tag.slice(1))
      .join("+");
    window.location.href = `/post-by-tags/${tags}`;
  };

  const handleSearch = async (query) => {
    fetch(`http://localhost:8800/owner/${query}/search-for-owners`)
      .then((response) => response.json())
      .then((data) => {
        const owners = data.data.map((owner) => ({
          key: owner.ownerid,
          text: owner.owner_name,
          value: owner.ownerid,
        }));
        setSearchResults(owners);
        console.log(searchResults);
      })
      .catch((error) => console.error("Error fetching results:", error));
  };
  return (
    <>
      {" "}
      <form
        className="relative flex flex-1"
        action="#"
        method="GET"
        onSubmit={(e) => {
          e.preventDefault();
          handleTagSearch();
        }}
      >
        <label htmlFor="search-field" className="sr-only">
          Search
        </label>
        <MagnifyingGlassIcon
          className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400"
          aria-hidden="true"
        />
        <div className="w-10/12">
          <input
            id="search-field"
            className="block h-full w-full border-0 py-0 pl-8 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
            placeholder="Look for owners or use # to search for tags in posts"
            type="search"
            name="search"
            value={searchQuery}
            onChange={handleDynamicSearch}
          />
          <div className="absolute z-10 mr-5 w-10/12 bg-white rounded-lg shadow-lg">
            {searchResults.length > 0 && (
              <ul>
                {searchResults.map((result) => (
                  <li
                    className="p-1 hover:bg-blue-50 rounded-lg"
                    key={result.key}
                  >
                    <a className="m-5" href={`/profile/${result.key}`}>
                      {result.text}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <button className="ml-2" type="submit">
          Search Tags
        </button>
      </form>
    </>
  );
}
