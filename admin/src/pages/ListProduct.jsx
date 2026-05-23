import { useEffect, useState, useCallback } from "react";
import { makeApiRequest } from "../utils/apiService";
import { toast } from "sonner";
import Title from "../components/Title";
import Loading from "../components/Loading";
import Pagination from "../components/Pagination";

const PRODUCTS_PER_PAGE = 10;

const CATEGORIES = ["All", "Men", "Women", "Kids"];
const SORT_OPTIONS = [
  { label: "Relevant",    value: "relevant" },
  { label: "Price: Low → High", value: "low-high" },
  { label: "Price: High → Low", value: "high-low" },
  { label: "Newest First",      value: "newest" },
];
const PRICE_RANGES = [
  { label: "All Prices", min: 0,    max: Infinity },
  { label: "Under $50",  min: 0,    max: 50 },
  { label: "$50 – $100", min: 50,   max: 100 },
  { label: "$100 – $200",min: 100,  max: 200 },
  { label: "Over $200",  min: 200,  max: Infinity },
];

const ListProduct = () => {
  const [list, setList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  // Search
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  // Filters
  const [category, setCategory] = useState("All");
  const [priceRange, setPriceRange] = useState(0); // index into PRICE_RANGES
  const [sortType, setSortType] = useState("relevant");
  const [showFilters, setShowFilters] = useState(false);

  const fetchList = useCallback(async (page = 1, searchTerm = search, sort = sortType) => {
    setIsLoading(true);
    try {
      const res = await makeApiRequest("/api/product/search", "POST", {
        page,
        limit: PRODUCTS_PER_PAGE,
        search: searchTerm,
        sortType: sort,
      });

      const data = res.data?.data;
      if (data) {
        setList(data.products);
        setTotalPages(data.totalPages);
        setTotalProducts(data.totalProducts);
        setCurrentPage(data.currentPage);
      } else {
        toast.error(res.data?.message || "Failed to load products");
      }
    } catch (error) {
      toast.error(error.message || "An error occurred while fetching products");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [search, sortType]);

  useEffect(() => {
    fetchList(1, "", "relevant");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    fetchList(1, searchInput, sortType);
  };

  const handleSortChange = (val) => {
    setSortType(val);
    fetchList(1, search, val);
  };

  const handlePageChange = (page) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    fetchList(page, search, sortType);
  };

  const removeProduct = async (id) => {
    if (!window.confirm("Are you sure you want to remove this product?")) return;
    try {
      const res = await makeApiRequest(`/api/product/delete-product/${id}`, "DELETE", {});
      if (res.data?.statusCode === 200 || res.status === 200) {
        toast.success("Product removed successfully");
        await fetchList(currentPage, search, sortType);
      } else {
        toast.error(res.data?.message || "Failed to delete product");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the product");
      console.error(error);
    }
  };

  // Client-side category + price filter on the current page data
  const range = PRICE_RANGES[priceRange];
  const filtered = list.filter((item) => {
    const catMatch = category === "All" || item.category === category;
    const priceMatch = item.price >= range.min && item.price <= range.max;
    return catMatch && priceMatch;
  });

  const activeFiltersCount =
    (category !== "All" ? 1 : 0) +
    (priceRange !== 0 ? 1 : 0) +
    (sortType !== "relevant" ? 1 : 0);

  const clearFilters = () => {
    setCategory("All");
    setPriceRange(0);
    setSortType("relevant");
    fetchList(1, search, "relevant");
  };

  return (
    <div className="flex flex-col w-full gap-6 bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
            <Title text1={"Products "} text2={"List"} />
          </h2>
          {!isLoading && (
            <p className="text-sm text-gray-400 mt-1">
              {totalProducts} total
              {filtered.length !== list.length && (
                <span className="ml-1 text-indigo-500 font-medium">
                  · {filtered.length} shown
                </span>
              )}
            </p>
          )}
        </div>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search products..."
            className="border border-gray-200 text-sm px-4 py-2 rounded-lg outline-none focus:ring-1 focus:ring-black w-48 sm:w-64 bg-gray-50 transition-all"
          />
          <button
            type="submit"
            className="bg-black text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {/* ── Filter Bar ── */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Toggle filter panel */}
        <button
          onClick={() => setShowFilters((v) => !v)}
          className={`flex items-center gap-2 text-sm px-4 py-2 rounded-lg border transition-all font-medium ${
            showFilters || activeFiltersCount > 0
              ? "bg-black text-white border-black"
              : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z"
            />
          </svg>
          Filters
          {activeFiltersCount > 0 && (
            <span className="bg-white text-black text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </button>

        {/* Sort — always visible */}
        <select
          value={sortType}
          onChange={(e) => handleSortChange(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 outline-none focus:ring-1 focus:ring-black cursor-pointer transition-all"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        {/* Active filter chips */}
        {category !== "All" && (
          <span className="flex items-center gap-1 bg-indigo-50 text-indigo-700 text-xs font-medium px-3 py-1.5 rounded-full border border-indigo-200">
            {category}
            <button onClick={() => setCategory("All")} className="ml-1 hover:text-indigo-900">✕</button>
          </span>
        )}
        {priceRange !== 0 && (
          <span className="flex items-center gap-1 bg-indigo-50 text-indigo-700 text-xs font-medium px-3 py-1.5 rounded-full border border-indigo-200">
            {PRICE_RANGES[priceRange].label}
            <button onClick={() => setPriceRange(0)} className="ml-1 hover:text-indigo-900">✕</button>
          </span>
        )}
        {activeFiltersCount > 0 && (
          <button
            onClick={clearFilters}
            className="text-xs text-gray-400 hover:text-red-500 transition-colors underline underline-offset-2"
          >
            Clear all
          </button>
        )}
      </div>

      {/* ── Expanded Filter Panel ── */}
      {showFilters && (
        <div className="flex flex-wrap gap-6 p-5 bg-gray-50 rounded-xl border border-gray-100 animate-fade-in">
          {/* Category */}
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</p>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`text-sm px-4 py-1.5 rounded-full border font-medium transition-all ${
                    category === cat
                      ? "bg-black text-white border-black shadow-sm"
                      : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Price Range</p>
            <div className="flex flex-wrap gap-2">
              {PRICE_RANGES.map((range, idx) => (
                <button
                  key={idx}
                  onClick={() => setPriceRange(idx)}
                  className={`text-sm px-4 py-1.5 rounded-full border font-medium transition-all ${
                    priceRange === idx
                      ? "bg-black text-white border-black shadow-sm"
                      : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Table ── */}
      {isLoading ? (
        <Loading />
      ) : filtered.length === 0 ? (
        <div className="w-full text-center py-16 text-gray-500">
          <p className="text-4xl mb-3">📦</p>
          <p className="text-lg font-medium text-gray-700">No products found</p>
          <p className="text-sm mt-1">
            {search
              ? `No results for "${search}". Try a different search.`
              : activeFiltersCount > 0
              ? "No products match the current filters."
              : "Add some products to see them listed here."}
          </p>
          {activeFiltersCount > 0 && (
            <button
              onClick={clearFilters}
              className="mt-4 text-sm underline text-indigo-600 hover:text-indigo-800"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-col w-full">
          {/* Table Header */}
          <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-3 px-6 bg-gray-50 border border-gray-200 rounded-t-xl text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <span>Image</span>
            <span>Name</span>
            <span>Category</span>
            <span>Price</span>
            <span className="text-center">Action</span>
          </div>

          {/* Table Body */}
          <div className="border border-gray-200 md:border-t-0 rounded-xl md:rounded-t-none overflow-hidden divide-y divide-gray-100">
            {filtered.map((item, index) => (
              <div
                key={item._id || index}
                className="grid grid-cols-[auto_1fr_auto] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-3 sm:gap-4 py-3 sm:py-4 px-4 sm:px-6 hover:bg-gray-50 transition-colors text-sm text-gray-700"
              >
                {/* Image */}
                <img
                  className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-xl border border-gray-100"
                  src={Array.isArray(item.image) ? item.image[0] : item.image}
                  alt={item.name}
                />

                {/* Mobile Text */}
                <div className="flex flex-col gap-0.5 md:hidden">
                  <p className="font-medium text-gray-900 line-clamp-2 leading-tight">{item.name}</p>
                  <p className="text-xs text-gray-400">{item.category}</p>
                  <p className="text-sm font-semibold text-gray-800">${item.price}</p>
                  {item.bestSeller && (
                    <span className="text-xs text-amber-600 font-semibold">⭐ Bestseller</span>
                  )}
                </div>

                {/* Desktop Columns */}
                <div className="hidden md:flex flex-col gap-0.5">
                  <p className="font-medium text-gray-900 truncate">{item.name}</p>
                  {item.bestSeller && (
                    <span className="text-xs text-amber-600 font-semibold">⭐ Bestseller</span>
                  )}
                </div>
                <p className="hidden md:block text-gray-500">{item.category}</p>
                <p className="hidden md:block font-semibold text-gray-800">${item.price}</p>

                {/* Action */}
                <div className="text-right md:text-center">
                  <button
                    onClick={() => removeProduct(item._id)}
                    className="text-red-500 hover:text-white hover:bg-red-500 border border-red-200 hover:border-red-500 px-3 py-1.5 rounded-lg transition-all cursor-pointer font-medium text-xs sm:text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default ListProduct;
